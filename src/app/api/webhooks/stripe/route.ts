import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "payload";
import configPromise from "@payload-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development if webhook secret is not yet configured
      console.warn(
        "STRIPE WEBHOOK: Running without signature verification. Set STRIPE_WEBHOOK_SECRET in production."
      );
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const paymentIntentId = paymentIntent.id;

    try {
      const payload = await getPayload({ config: configPromise });

      // Check if order already exists (idempotency check)
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
        // Order already created by client action, ensure status is processing
        const order = existingOrders.docs[0];
        if (order.status === "pending") {
          await payload.update({
            collection: "orders",
            id: order.id,
            data: {
              status: "processing",
            },
          });
        }
      } else {
        // Client disconnected or closed tab before createOrderAction completed.
        // Webhook fulfills the order reliably:
        const userId = Number(paymentIntent.metadata.userId);
        if (userId) {
          let itemsData: Array<{
            product: number;
            quantity: number;
            price: number;
            isSample: boolean;
          }> = [];

          if (paymentIntent.metadata.itemsSummary) {
            try {
              const parsed = JSON.parse(paymentIntent.metadata.itemsSummary);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              itemsData = parsed.map((item: any) => ({
                product: Number(item.p),
                quantity: Number(item.q),
                price: Number(item.pr),
                isSample: Boolean(item.s),
              }));
            } catch (parseErr) {
              console.error("Webhook: Failed to parse itemsSummary:", parseErr);
            }
          }

          const total = (paymentIntent.amount || 0) / 100;

          await payload.create({
            collection: "orders",
            data: {
              user: userId,
              total,
              status: "processing",
              paymentIntentId,
              items: itemsData,
            },
          });
        }
      }

      // If this was a quote checkout, ensure quote status is marked as paid
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
          console.error("Webhook: Failed to update quote status:", quoteErr);
        }
      }
    } catch (dbError) {
      console.error("Webhook: Database error processing order fulfillment:", dbError);
      return NextResponse.json(
        { error: "Order fulfillment failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
