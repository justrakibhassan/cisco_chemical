import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, type ModelMessage } from "ai";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import fs from "fs";

export const maxDuration = 30;

const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages: rawMessages } = await req.json() as { 
      messages: Array<{ 
        role: string; 
        content?: string; 
        parts?: Array<{ type: string; text?: string }>;
      }> 
    };
    
    // Convert UIMessages (v6) to CoreMessages (expected by streamText)
    const messages: ModelMessage[] = rawMessages.map((m) => {
      let content = "";
      if (typeof m.content === 'string') {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = m.parts
          .filter(p => p.type === 'text')
          .map(p => p.text || "")
          .join('');
      } else if (m.content && typeof m.content === 'object') {
        content = JSON.stringify(m.content);
      }
      
      return {
        role: m.role as ModelMessage["role"],
        content,
      } as unknown as ModelMessage;
    });

    const lastMessageObj = messages[messages.length - 1];
    const rawSearchQuery = typeof lastMessageObj?.content === 'string' ? lastMessageObj.content : "";
    
    // 1. RAG: Search PayloadCMS for relevant products
    let productContext = "";
    try {
      const payload = await getPayload({ config: configPromise });
      
      const searchTerms = rawSearchQuery.split(' ').filter((word: string) => word.length > 2);
      const searchTerm = searchTerms[0] || rawSearchQuery;

      if (searchTerm) {
        const { docs: products } = await payload.find({
          collection: "products",
          where: {
            or: [
              { name: { contains: searchTerm } },
              { slug: { contains: searchTerm } }
            ]
          },
          limit: 3,
        });

        productContext = products.map(p => 
          `- Name: ${p.name}\n  Price: $${p.price}\n  Description: ${p.description}\n  Link: /products/${p.slug}`
        ).join('\n\n');
      }
    } catch (ragError) {
      console.error("RAG ERROR:", ragError);
    }

    const systemPrompt = `You are the Cisco Chemical Assistant, a helpful AI expert in industrial chemicals and laboratory solutions. 
Your goal is to assist customers with product information, usage guidelines, and order inquiries.

${productContext ? `Here is the current catalog information related to the inquiry:\n${productContext}\n\n` : ""}

Guidelines:
1. Always be professional, technical yet accessible.
2. If a specific product is mentioned in the context above, provide its price and details accurately.
3. Use markdown for formatting.`;

    console.log("INVOKING GEMINI-2.0-FLASH VIA v1beta...");

    // 2. Call Gemini
    const result = streamText({
      model: googleAI("gemini-flash-latest"),
      system: systemPrompt,
      messages,
    });

    console.log("STREAMING RESPONSE STARTED.");

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CRITICAL AI CHAT ERROR:", error);
    fs.appendFileSync("chat-error.log", JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, null, 2) + "\n---\n");
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isQuotaExceeded = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED");

    return new Response(
      JSON.stringify({ 
        error: isQuotaExceeded ? "AI Quota Exceeded" : "Failed to process chat request", 
        details: isQuotaExceeded 
          ? "You've reached the Gemini Free Tier limit. Please wait a moment before trying again." 
          : errorMessage,
      }),
      { status: isQuotaExceeded ? 429 : 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
