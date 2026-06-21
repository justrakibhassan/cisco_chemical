import { getPayload } from "payload";
import configPromise from "@payload-config";
import React from "react";
import DashboardCharts from "./DashboardCharts";
import { Order, Quote, User } from "@/payload-types";

export default async function CustomDashboard() {
  const payload = await getPayload({ config: configPromise });

  // 1. Fetch orders
  const ordersResult = await payload.find({
    collection: "orders",
    limit: 1000,
    sort: "-createdAt",
  });
  const orders = (ordersResult.docs || []) as unknown as Order[];

  // 2. Fetch quotes
  const quotesResult = await payload.find({
    collection: "quotes",
    limit: 1000,
    sort: "-createdAt",
  });
  const quotes = (quotesResult.docs || []) as unknown as Quote[];

  // 3. Fetch users
  const usersResult = await payload.find({
    collection: "users",
    limit: 1000,
  });
  const users = (usersResult.docs || []) as unknown as User[];

  // 4. Fetch products
  const productsResult = await payload.find({
    collection: "products",
    limit: 1,
  });
  const totalProducts = productsResult.totalDocs || 0;

  // 5. Aggregate overall metrics
  const totalRevenue = orders
    .filter(o => o.status !== "cancelled" && o.status !== "pending")
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const totalOrders = orders.length;
  const pendingQuotes = quotes.filter(q => q.status === "pending").length;

  const totalQuotes = quotes.length;
  const convertedQuotes = quotes.filter(q => q.status === "quoted" || q.status === "paid").length;
  const conversionRate = totalQuotes > 0 ? Math.round((convertedQuotes / totalQuotes) * 100) : 0;
  const totalCustomers = users.filter(u => u.role === "user").length;

  // 6. Aggregate Sales Velocity data (last 10 days of non-cancelled order dates)
  const salesByDateMap = new Map<string, { date: string; amount: number; timestamp: number }>();
  
  orders.forEach(order => {
    if (order.status !== "cancelled") {
      const d = new Date(order.createdAt);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const existing = salesByDateMap.get(dateStr);
      if (existing) {
        existing.amount += order.total;
      } else {
        const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        salesByDateMap.set(dateStr, { date: dateStr, amount: order.total, timestamp: startOfDay });
      }
    }
  });

  const salesVelocity = Array.from(salesByDateMap.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ date, amount }) => ({ date, sales: amount }))
    .slice(-10); // Last 10 days

  // 7. Aggregate Order Statuses Distribution data
  const statusCounts: { [key: string]: number } = {};
  orders.forEach(order => {
    const status = order.status || "pending";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const orderStatuses = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
  }));

  // 8. Aggregate Quote Conversion stages
  const quoteStatusCounts = {
    pending: 0,
    quoted: 0,
    paid: 0,
    cancelled: 0,
  };
  quotes.forEach(quote => {
    if (quote.status in quoteStatusCounts) {
      quoteStatusCounts[quote.status as keyof typeof quoteStatusCounts]++;
    }
  });
  const quoteConversion = [
    { name: "Pending", count: quoteStatusCounts.pending },
    { name: "Approved (Quoted)", count: quoteStatusCounts.quoted },
    { name: "Paid", count: quoteStatusCounts.paid },
    { name: "Cancelled", count: quoteStatusCounts.cancelled },
  ];

  return (
    <DashboardCharts
      salesVelocity={salesVelocity}
      orderStatuses={orderStatuses}
      quoteConversion={quoteConversion}
      stats={{
        totalRevenue,
        totalOrders,
        pendingQuotes,
        conversionRate,
        totalProducts,
        totalCustomers,
      }}
    />
  );
}
