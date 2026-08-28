"use client";

import { Order as OrderType, Quote as QuoteType } from "@/payload-types";
import { Package, Calendar, ChevronRight, Calculator, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { DownloadInvoice } from "../components/download-invoice";

interface OrdersViewProps {
  orders: OrderType[];
  quotes: QuoteType[];
  user: {
    name?: string | null;
    email: string;
  };
}

export const OrdersView = ({ orders, quotes, user }: OrdersViewProps) => {
  const [activeTab, setActiveTab] = useState<"orders" | "quotes">("orders");

  const getOrderStatusColor = (status: OrderType["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getQuoteStatusColor = (status: QuoteType["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "quoted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage your orders and bulk quote requests
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quick-order"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 text-sm gap-2"
            >
              <Calculator className="w-4 h-4" />
              Quick Order (Bulk)
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm"
            >
              New Single Order
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === "orders"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${
              activeTab === "quotes"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Quote Requests ({quotes.length})
          </button>
        </div>

        {activeTab === "orders" ? (
          /* Orders Table */
          orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Package className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                You haven&apos;t placed any direct orders yet.
              </p>
              <Link
                href="/products"
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Total</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-gray-900">
                            #{String(order.id).slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span suppressHydrationWarning>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getOrderStatusColor(
                              order.status
                            )} uppercase tracking-wider`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-gray-1000">
                            ${order.total.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DownloadInvoice order={order} user={user} />
                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* Quotes Table */
          quotes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Calculator className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No quotes yet</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Request bulk quotes for discounted pricing on large quantities.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-gray-500">
                        #{String(quote.id).slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getQuoteStatusColor(
                          quote.status
                        )} uppercase tracking-widest`}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span suppressHydrationWarning>
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {quote.items?.length} items
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 italic">
                      &quot;{quote.note || "No note provided"}&quot;
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {quote.status === "pending" && (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Reviewing</span>
                      </div>
                    )}

                    {quote.status === "quoted" && (
                      <div className="text-right space-y-3">
                        <div className="text-sm text-gray-500 font-medium">Approved Price</div>
                        <div className="text-3xl font-black text-slate-900">
                          ${quote.quotedPrice?.toLocaleString()}
                        </div>
                        <button
                          onClick={() => {
                            toast.info("Connecting to Stripe...");
                            // In a real app, this would redirect to checkout with the quote ID
                          }}
                          className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Pay & Order Now
                        </button>
                      </div>
                    )}

                    {quote.status === "paid" && (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Paid & Confirmed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
