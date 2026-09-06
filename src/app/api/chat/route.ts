import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, type ModelMessage } from "ai";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const maxDuration = 30;

const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

// Helper function to extract plain text from Lexical richText AST
function extractTextFromLexical(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  if ("text" in node && typeof (node as { text: unknown }).text === "string") {
    return (node as { text: string }).text;
  }
  if ("children" in node && Array.isArray((node as { children: unknown[] }).children)) {
    return (node as { children: unknown[] }).children
      .map(extractTextFromLexical)
      .filter(Boolean)
      .join(" ");
  }
  if ("root" in node && typeof (node as { root: unknown }).root === "object") {
    return extractTextFromLexical((node as { root: unknown }).root);
  }
  return "";
}

const STOP_WORDS = new Set([
  "what", "is", "are", "the", "a", "an", "for", "to", "in", "of", "and",
  "can", "you", "tell", "me", "about", "show", "give", "how", "much", "does",
  "cost", "price", "have", "with", "from", "that", "this", "please", "i", "we",
  "need", "want", "looking", "do", "any", "some"
]);

export async function POST(req: Request) {
  try {
    const { messages: rawMessages } = (await req.json()) as {
      messages: Array<{
        role: string;
        content?: string;
        parts?: Array<{ type: string; text?: string }>;
      }>;
    };

    // Convert UIMessages (v6) to CoreMessages (expected by streamText)
    const messages: ModelMessage[] = rawMessages.map((m) => {
      let content = "";
      if (typeof m.content === "string") {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text || "")
          .join("");
      } else if (m.content && typeof m.content === "object") {
        content = JSON.stringify(m.content);
      }

      return {
        role: m.role as ModelMessage["role"],
        content,
      } as unknown as ModelMessage;
    });

    const lastMessageObj = messages[messages.length - 1];
    const rawSearchQuery =
      typeof lastMessageObj?.content === "string" ? lastMessageObj.content : "";

    // 1. RAG: Search PayloadCMS for relevant products
    let productContext = "";
    try {
      const payload = await getPayload({ config: configPromise });

      const cleanedWords = rawSearchQuery
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

      const searchTerm = cleanedWords[0] || "";

      if (searchTerm) {
        const { docs: products } = await payload.find({
          collection: "products",
          where: {
            or: [
              { name: { contains: searchTerm } },
              { slug: { contains: searchTerm } },
            ],
          },
          limit: 3,
        });

        if (products.length > 0) {
          productContext = products
            .map((p) => {
              let desc = "";
              if (typeof p.description === "string") {
                desc = p.description;
              } else if (p.description) {
                desc = extractTextFromLexical(p.description);
              }
              const safeDesc = desc
                ? desc.slice(0, 200)
                : "High-grade industrial chemical product.";

              return `- Name: ${p.name}\n  Price: $${p.price}\n  Description: ${safeDesc}\n  Link: /products/${p.slug}`;
            })
            .join("\n\n");
        }
      }
    } catch (ragError) {
      console.error("RAG context retrieval error:", ragError);
    }

    const systemPrompt = `You are the Cisco Chemical Assistant, a helpful AI expert in industrial chemicals and laboratory solutions. 
Your goal is to assist customers with product information, usage guidelines, and order inquiries.

${productContext ? `Here is the current catalog information related to the inquiry:\n${productContext}\n\n` : ""}

Guidelines:
1. Always be professional, technical yet accessible.
2. If a specific product is mentioned in the context above, provide its price and details accurately.
3. Use markdown for formatting.`;

    // 2. Call Gemini
    const result = streamText({
      model: googleAI("gemini-2.5-flash"),
      system: systemPrompt,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CRITICAL AI CHAT ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isQuotaExceeded =
      errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");

    return new Response(
      JSON.stringify({
        error: isQuotaExceeded
          ? "AI Quota Exceeded"
          : "Failed to process chat request",
        details: isQuotaExceeded
          ? "You've reached the Gemini Free Tier limit. Please wait a moment before trying again."
          : errorMessage,
      }),
      {
        status: isQuotaExceeded ? 429 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

