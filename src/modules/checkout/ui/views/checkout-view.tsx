"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntentAction, createOrderAction } from "@/modules/checkout/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/providers/currency-provider";

// Initialize Stripe outside component to avoid re-creation
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import { Quote } from "@/payload-types";

interface CheckoutViewProps {
  quoteId?: string;
  initialQuote?: Quote | null;
}

const CheckoutForm = ({
  total,
  isQuoteOrder = false,
}: {
  total: number;
  isQuoteOrder?: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        // Record and verify the order in Payload CMS using the verified payment intent ID
        await createOrderAction(paymentIntent.id);
        toast.success(
          isQuoteOrder
            ? "Quote payment successful! Your bulk order is being processed."
            : "Payment successful!"
        );
        if (!isQuoteOrder) {
          clearCart();
        }
        router.push("/checkout/success");
      } catch (err) {
        console.error("Error finalizing order:", err);
        toast.error(
          "Payment succeeded but order sync failed. Our team will verify your payment."
        );
        router.push("/checkout/success");
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "tabs" }} />

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/30 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatPrice(total)}`
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3" />
        Payments are secure and encrypted
      </p>
    </form>
  );
};

export const CheckoutView = ({
  quoteId,
  initialQuote,
}: CheckoutViewProps) => {
  const { items, total, isLoaded } = useCart();
  const { formatPrice } = useCurrency();
  const [clientSecret, setClientSecret] = useState("");
  const [serverTotal, setServerTotal] = useState<number | null>(
    initialQuote?.quotedPrice ?? null
  );

  const isQuoteOrder = Boolean(quoteId && initialQuote);
  const itemsKey = items
    .map((i) => `${i.id}:${i.quantity}:${i.isSample ? "sample" : "reg"}`)
    .join(",");

  useEffect(() => {
    if (isQuoteOrder && quoteId) {
      createPaymentIntentAction({ quoteId })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
          if (data.serverTotal !== undefined) {
            setServerTotal(data.serverTotal);
          }
        })
        .catch((err) => {
          console.error("Quote payment init error:", err);
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to initialize quote payment"
          );
        });
    } else if (items.length > 0) {
      createPaymentIntentAction({ items })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
          if (data.serverTotal !== undefined) {
            setServerTotal(data.serverTotal);
          }
        })
        .catch((err) => {
          console.error("Payment init error:", err);
          toast.error(
            err instanceof Error ? err.message : "Failed to initialize payment"
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuoteOrder ? quoteId : itemsKey]);

  if (!isLoaded && !isQuoteOrder) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (!isQuoteOrder && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent className="space-y-6 pt-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Cart is Empty</h2>
              <p className="text-gray-500">
                Add some products to proceed with checkout.
              </p>
            </div>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const effectiveTotal = serverTotal ?? (isQuoteOrder ? initialQuote?.quotedPrice ?? 0 : total);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-8">
          <Link
            href={isQuoteOrder ? "/orders" : "/cart"}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {isQuoteOrder ? "Back to Orders & Quotes" : "Back to Cart"}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Order Summary */}
          <div className="space-y-6 lg:order-2">
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gray-900 text-white p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                  {isQuoteOrder && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      B2B Quote Approved
                    </span>
                  )}
                </div>
                <CardDescription className="text-gray-300">
                  {isQuoteOrder
                    ? `Review approved quote items (#${String(initialQuote?.id).slice(-8).toUpperCase()})`
                    : "Review your items before payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto p-6 space-y-6">
                  {isQuoteOrder && initialQuote ? (
                    initialQuote.items?.map((item, idx) => {
                      const prodName =
                        typeof item.product === "object" && item.product !== null
                          ? item.product.name
                          : `Chemical Line Item #${idx + 1}`;
                      const prodImg =
                        typeof item.product === "object" &&
                        item.product !== null &&
                        typeof item.product.mainImage === "object" &&
                        item.product.mainImage !== null
                          ? (item.product.mainImage as { url?: string }).url
                          : "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop";

                      return (
                        <div key={idx} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                            <Image
                              src={prodImg || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"}
                              alt={prodName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {prodName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} Units (Bulk Batch)
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-sm text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Separator />
                <div className="p-6 space-y-3 bg-gray-50/50">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(effectiveTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>B2B Freight Shipping</span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total to Pay</span>
                    <span>{formatPrice(effectiveTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="hidden lg:flex items-center justify-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Encrypted and Secure Payment</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:order-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isQuoteOrder ? "Finalize Quote Payment" : "Checkout"}
              </h1>
              <p className="text-gray-500">
                {isQuoteOrder
                  ? "Pay your approved B2B chemical quote securely via Stripe."
                  : "Complete your purchase securely."}
              </p>
            </div>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Enter your payment method below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret ? (
                  <Elements
                    options={{
                      clientSecret,
                      appearance: { theme: "stripe" },
                    }}
                    stripe={stripePromise}
                  >
                    <CheckoutForm
                      total={effectiveTotal}
                      isQuoteOrder={isQuoteOrder}
                    />
                  </Elements>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    <p className="text-sm text-gray-500">
                      Initializing secure checkout...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
