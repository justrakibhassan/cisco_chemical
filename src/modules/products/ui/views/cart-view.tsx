"use client";

import { useCart } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/providers/currency-provider";

export const CartView = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart, isLoaded } = useCart();
  const { formatPrice } = useCurrency();

  if (!isLoaded) {
    return (
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sticky top-24 space-y-6">
              <Skeleton className="h-7 w-32" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors truncate block"
                >
                  {item.name}
                </Link>
                <p className="text-green-600 font-bold mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 hover:text-green-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        updateQuantity(item.id, value);
                      }
                    }}
                    className="w-12 h-full text-center font-medium text-gray-900 bg-transparent border-x border-gray-200 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 hover:text-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-extrabold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-[0.98]"
            >
              Checkout Now
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-4 text-center text-xs text-gray-400">
              Secure payment processing by Cisco Chemical
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
