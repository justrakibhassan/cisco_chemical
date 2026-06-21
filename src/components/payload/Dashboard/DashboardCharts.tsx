"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { 
  TrendingUp, 
  ShoppingBag, 
  BarChart3, 
  DollarSign, 
  Layers,
  FileText,
  Users
} from "lucide-react";

interface ChartDataPoint {
  date: string;
  sales: number;
}

interface StatusDataPoint {
  name: string;
  value: number;
}

interface QuoteDataPoint {
  name: string;
  count: number;
}

interface DashboardChartsProps {
  salesVelocity: ChartDataPoint[];
  orderStatuses: StatusDataPoint[];
  quoteConversion: QuoteDataPoint[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    pendingQuotes: number;
    conversionRate: number;
    totalProducts: number;
    totalCustomers: number;
  };
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];

export default function DashboardCharts({
  salesVelocity,
  orderStatuses,
  quoteConversion,
  stats,
}: DashboardChartsProps) {
  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen font-sans">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Executive Command Center
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Real-time sales velocity, quotes conversions, and chemical procurement analytics.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Live Analytics Enabled
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-950">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-slate-400 text-xs font-bold mt-1">Accumulated Order Payments</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quote Conversion</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-950">{stats.conversionRate}%</h3>
            <p className="text-slate-400 text-xs font-bold mt-1">Pending to Approved Quotes</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-950">{stats.pendingQuotes}</h3>
            <p className="text-slate-400 text-xs font-bold mt-1">Active Quote Requests Waiting</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Customers</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-950">{stats.totalCustomers}</h3>
            <p className="text-slate-400 text-xs font-bold mt-1">Registered Enterprise Users</p>
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Sales Velocity */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight">Sales Velocity</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Chronological revenue statistics from paid orders.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="h-80 w-full">
            {salesVelocity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} 
                    labelStyle={{ fontWeight: 'black', fontSize: 10, textTransform: 'uppercase', color: '#0f172a' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="sales" name="Sales Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                No orders revenue data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Order Statuses Distribution */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight">Order Statuses</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Distribution of current active orders.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="h-60 w-full flex-1 relative flex items-center justify-center">
            {orderStatuses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatuses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {orderStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem' }}
                    itemStyle={{ fontSize: 11, fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 font-bold text-sm">No orders registered.</div>
            )}
          </div>
          {orderStatuses.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
              {orderStatuses.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider">
                    {entry.name.toLowerCase()} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chart 3: Quote Conversions */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight">Quotes Conversion Funnel</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Comparison of procurement quotes processing stages.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="h-80 w-full">
            {quoteConversion.some(q => q.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quoteConversion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem' }}
                    labelStyle={{ fontWeight: 'black', fontSize: 10, color: '#0f172a' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: 12 }}
                  />
                  <Bar dataKey="count" name="Quote Requests" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {quoteConversion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                No quote conversion data registered.
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
