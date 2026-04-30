'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { Download, FileText, TrendingUp, AlertCircle, Package, Award, ShoppingCart } from 'lucide-react'

export default function DashboardClient({ initialMetrics, lowStock, recentOrders, bestSellers, chartData7d, chartData6m }) {
  const [timeRange, setTimeRange] = useState('7d')
  const activeChartData = timeRange === '7d' ? chartData7d : chartData6m

  const downloadCSV = () => {
    const headers = "Date,Revenue (NGN),Orders\n"
    const rows = activeChartData.map(d => `${d.date},${d.revenue},${d.orders}`).join("\n")
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reckless-era-analytics-${timeRange}.csv`
    a.click()
  }

  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="text-left w-full print:bg-white print:m-0 print:p-0">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Command Center</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Overview and analytics for Reckless Era.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white cursor-pointer shadow-sm transition-all"
          >
            <option value="7d">Last 7 Days (Daily)</option>
            <option value="6m">Past 6 Months (Monthly)</option>
          </select>
          
          <button onClick={downloadCSV} className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
            <FileText className="h-4 w-4 text-gray-500" /> CSV
          </button>
          
          <button 
            onClick={downloadPDF} 
            className="flex items-center gap-2 bg-brand-gold text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      <div id="dashboard-report" className="space-y-8 print:space-y-6">
        
        {/* KPI Grid - Upgraded with hover floating and colored icon backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
          <Link href="/admin/orders" className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-pink/30 hover:-translate-y-1 transition-all duration-300 group print:shadow-none print:border-black">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-pink/10 rounded-xl group-hover:bg-brand-pink/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-brand-pink print:text-black" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider print:text-black">Total Revenue</h3>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 print:text-black">₦{initialMetrics.revenue.toLocaleString()}</p>
          </Link>
          
          <Link href="/admin/orders" className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-300 group print:shadow-none print:border-black">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-gold/10 rounded-xl group-hover:bg-brand-gold/20 transition-colors">
                <Package className="h-6 w-6 text-brand-gold print:text-black" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider print:text-black">Total Orders</h3>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 print:text-black">{initialMetrics.ordersCount}</p>
          </Link>

          <Link href="/admin/products" className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 group print:shadow-none print:border-black">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                <AlertCircle className="h-6 w-6 text-gray-600 print:text-black" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider print:text-black">Active Products</h3>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 print:text-black">{initialMetrics.productsCount}</p>
          </Link>
        </div>

        {/* Recharts Analytics Area - Upgraded with SaaS Gradients */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-black">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 print:text-black">
              Revenue Overview <span className="text-brand-pink text-sm font-medium ml-2 px-2 py-1 bg-brand-pink/10 rounded-md">({timeRange === '7d' ? 'Daily' : 'Monthly'})</span>
            </h3>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={300}>
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-pink)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-brand-pink)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'var(--color-brand-pink)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-pink)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid: Low Stock, Best Sellers, & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:break-inside-avoid">
          
          {/* Low Stock Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-black flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white print:border-black">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider print:text-black flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-brand-red" />
                Low Stock Alerts
              </h3>
            </div>
            <div className="divide-y divide-gray-50 print:divide-black flex-1 overflow-y-auto">
              {lowStock.length === 0 ? (
                <p className="p-8 text-center text-sm font-medium text-gray-500">Inventory levels are healthy.</p>
              ) : (
                lowStock.map(product => (
                  <Link href={`/admin/products/${product.id}`} key={product.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors block group">
                    <div>
                      <p className="text-sm font-bold text-gray-900 print:text-black group-hover:text-brand-pink transition-colors truncate pr-2">{product.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">SKU: {product.sku}</p>
                    </div>
                    {/* SaaS Alert Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red whitespace-nowrap">
                      {product.stock_count} left
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Best Sellers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-black flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2 bg-white print:border-black">
              <Award className="h-4 w-4 text-brand-gold print:text-black" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider print:text-black">Top Sellers</h3>
            </div>
            <div className="divide-y divide-gray-50 print:divide-black flex-1 overflow-y-auto">
              {bestSellers?.length === 0 ? (
                <p className="p-8 text-center text-sm font-medium text-gray-500">No sales data yet.</p>
              ) : (
                bestSellers?.map((product) => (
                  <Link href={`/admin/products/${product.id}`} key={product.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors block group">
                    {product.images?.[0]?.image_url ? (
                      <img src={product.images[0].image_url} alt={product.title} className="h-12 w-12 rounded-xl object-cover border border-gray-100 flex-shrink-0 shadow-sm" />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 print:text-black group-hover:text-brand-pink transition-colors truncate">{product.title}</p>
                      <p className="text-xs text-brand-gold font-bold mt-0.5">₦{product.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-gray-900 print:text-black">{product.total_sold}</span>
                      <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Sold</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-black flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white print:border-black">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider print:text-black flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-brand-pink" />
                Live Transactions
              </h3>
            </div>
            <div className="divide-y divide-gray-50 print:divide-black flex-1 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <p className="p-8 text-center text-sm font-medium text-gray-500">No orders placed yet.</p>
              ) : (
                recentOrders.map(order => (
                  <Link href={`/admin/orders/${order.id}`} key={order.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors block group">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-sm font-bold text-gray-900 print:text-black group-hover:text-brand-pink transition-colors truncate">
                        {order.customer?.name || order.customer?.email || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-extrabold text-gray-900 print:text-black">₦{order.total_amount.toLocaleString()}</p>
                      <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${order.status === 'completed' ? 'text-green-500' : 'text-brand-gold'}`}>
                        {order.status}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}