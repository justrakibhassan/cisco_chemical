"use server";

import Stripe from "stripe";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getCurrentUser } from "@/modules/auth/actions";
import { CartItem } from "@/hooks/use-cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

interface CreatePaymentIntentParams {
  items?: CartItem[];
  quoteId?: string | number;
}

export const createPaymentIntentAction = async ({
  items,
  quoteId,
}: CreatePaymentIntentParams) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to proceed with checkout");
  }

  const payload = await getPayload({ config: configPromise });
  let calculatedTotal = 0;
  const verifiedItems: Array<{
    product: number;
    quantity: number;
    price: number;
    isSample: boolean;
  }> = [];

  if (quoteId) {
    // Quote Checkout: Fetch quote and verify ownership
    const quote = await payload.findByID({
      collection: "quotes",
      id: Number(quoteId),
    });

    if (!quote) throw new Error("Quote not found");
    const quoteUserId = typeof quote.user === "object" ? quote.user.id : quote.user;
    if (quoteUserId !== user.id) {
      throw new Error("Unauthorized quote checkout attempt");
    }

    if (quote.status !== "quoted" || !quote.quotedPrice) {
      throw new Error("This quote is not approved for payment yet");
    }

    calculatedTotal = quote.quotedPrice;
  } else if (items && items.length > 0) {
    // Cart Checkout: Fetch each product from DB to verify price
    for (const item of items) {
      const productId = Number(String(item.id).replace("-sample", "").split("-")[0]);
      if (isNaN(productId)) {
        throw new Error(`Invalid product ID format: ${item.id}`);
      }

      const product = await payload.findByID({
        collection: "products",
        id: productId,
      });

      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }

      const isSample = Boolean(item.isSample || String(item.id).includes("-sample"));
      // Lab sample flat rate is $50, otherwise verified product price from DB
      const verifiedPrice = isSample ? 50 : Number(product.price);
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      calculatedTotal += verifiedPrice * quantity;
      verifiedItems.push({
        product: productId,
        quantity,
        price: verifiedPrice,
        isSample,
      });
    }
  } else {
    throw new Error("No checkout items provided");
  }

  if (calculatedTotal <= 0) {
    throw new Error("Order total must be greater than zero");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(calculatedTotal * 100), // Stripe expects amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: String(user.id),
        userEmail: user.email,
        quoteId: quoteId ? String(quoteId) : "",
        orderType: quoteId ? "quote" : "cart",
        itemsSummary: JSON.stringify(
          verifiedItems.map((i) => ({
            p: i.product,
            q: i.quantity,
            pr: i.price,
            s: i.isSample,
          }))
        ),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      serverTotal: calculatedTotal,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
};

export const createOrderAction = async (paymentIntentId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Verify payment intent directly with Stripe API
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (!paymentIntent) {
    throw new Error("Payment intent not found");
  }

  if (paymentIntent.status !== "succeeded") {
    throw new Error(
      `Payment is not confirmed. Current status: ${paymentIntent.status}`
    );
  }

  if (paymentIntent.metadata.userId !== String(user.id)) {
    throw new Error("Payment intent does not belong to the current user");
  }

  const payload = await getPayload({ config: configPromise });

  // Idempotency: Check if an order already exists for this payment intent
  const existingOrders = await payload.find({
    collection: "orders",
    where: {
      paymentIntentId: {
        equals: paymentIntentId,
      },
    },
    limit: 1,
  });

  if (existingOrders.docs.length > 0) {
    return existingOrders.docs[0];
  }

  // Parse item snapshots from payment intent metadata
  let itemsData: Array<{
    product: number;
    quantity: number;
    price: number;
    isSample: boolean;
  }> = [];

  try {
    if (paymentIntent.metadata.itemsSummary) {
      const parsed = JSON.parse(paymentIntent.metadata.itemsSummary);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemsData = parsed.map((item: any) => ({
        product: Number(item.p),
        quantity: Number(item.q),
        price: Number(item.pr),
        isSample: Boolean(item.s),
      }));
    }
  } catch (err) {
    console.error("Failed to parse items from payment intent metadata:", err);
  }

  const total = (paymentIntent.amount || 0) / 100;

  try {
    const order = await payload.create({
      collection: "orders",
      data: {
        user: user.id,
        total,
        status: "processing",
        paymentIntentId,
        items: itemsData,
      },
    });

    // If this was a quote payment, update the quote status to paid
    if (paymentIntent.metadata.quoteId) {
      try {
        await payload.update({
          collection: "quotes",
          id: Number(paymentIntent.metadata.quoteId),
          data: {
            status: "paid",
          },
        });
      } catch (quoteErr) {
        console.error("Failed to mark quote as paid:", quoteErr);
      }
    }

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

