import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import { Metadata } from "next";
import { getCurrentUser } from "@/modules/auth/actions";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Quote } from "@/payload-types";

export const metadata: Metadata = {
  title: "Secure Checkout | Cisco Chemical",
  description: "Complete your purchase securely.",
};

interface CheckoutPageProps {
  searchParams: Promise<{
    quoteId?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { quoteId } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    const callback = quoteId ? `/checkout?quoteId=${quoteId}` : "/checkout";
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callback)}`);
  }

  let quoteData: Quote | null = null;

  if (quoteId) {
    try {
      const payload = await getPayload({ config: configPromise });
      const quote = await payload.findByID({
        collection: "quotes",
        id: Number(quoteId),
        depth: 2,
      });

      const quoteUserId =
        typeof quote.user === "object" ? quote.user.id : quote.user;
      if (quoteUserId === user.id && quote.status === "quoted") {
        quoteData = quote as Quote;
      }
    } catch (err) {
      console.error("Error fetching quote for checkout:", err);
    }
  }

  return <CheckoutView quoteId={quoteId} initialQuote={quoteData} />;
}

