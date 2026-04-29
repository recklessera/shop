'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { Download, FileText, TrendingUp, AlertCircle, Package, Award } from 'lucide-react'

// Notice we now accept BOTH chart data arrays as props
export default function DashboardClient({ initialMetrics, lowStock, recentOrders, bestSellers, chartData7d, chartData6m }) {
  // Default view is the 7-day daily view
  const [timeRange, setTimeRange] = useState('7d')

  // Dynamically choose which data array to feed into the chart and CSV
  const activeChartData = timeRange === '7d' ? chartData7d : chartData6m

  const downloadCSV = () => {
    const headers = "Date,Revenue (NGN),Orders\n"
    // We map over the activeChartData so the CSV perfectly matches what is on the screen
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Overview and analytics for Reckless Era.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* UPDATED DROPDOWN */}
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-background cursor-pointer"
          >
            <option value="7d">Last 7 Days (Daily)</option>
            <option value="6m">Past 6 Months (Monthly)</option>
          </select>
          
          <button onClick={downloadCSV} className="flex items-center gap-2 border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
            <FileText className="h-4 w-4" /> CSV
          </button>
          
          <button 
            onClick={downloadPDF} 
            className="flex items-center gap-2 bg-foreground text-background px-3 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* The Printable Report Container */}
      <div id="dashboard-report" className="space-y-8 bg-background print:space-y-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
          <Link href="/admin/orders" className="block border border-gray-200 p-6 rounded-lg shadow-sm hover:border-foreground transition-colors group print:shadow-none print:border-black">
            <div className="flex items-center gap-3 text-gray-500 mb-2 group-hover:text-foreground transition-colors">
              <TrendingUp className="h-5 w-5 print:text-black" />
              <h3 className="text-sm font-medium uppercase tracking-wider print:text-black">Total Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-foreground print:text-black">₦{initialMetrics.revenue.toLocaleString()}</p>
          </Link>
          
          <Link href="/admin/orders" className="block border border-gray-200 p-6 rounded-lg shadow-sm hover:border-foreground transition-colors group print:shadow-none print:border-black">
            <div className="flex items-center gap-3 text-gray-500 mb-2 group-hover:text-foreground transition-colors">
              <Package className="h-5 w-5 print:text-black" />
              <h3 className="text-sm font-medium uppercase tracking-wider print:text-black">Total Orders</h3>
            </div>
            <p className="text-3xl font-bold text-foreground print:text-black">{initialMetrics.ordersCount}</p>
          </Link>

          <Link href="/admin/products" className="block border border-gray-200 p-6 rounded-lg shadow-sm hover:border-foreground transition-colors group print:shadow-none print:border-black">
            <div className="flex items-center gap-3 text-gray-500 mb-2 group-hover:text-foreground transition-colors">
              <AlertCircle className="h-5 w-5 print:text-black" />
              <h3 className="text-sm font-medium uppercase tracking-wider print:text-black">Active Products</h3>
            </div>
            <p className="text-3xl font-bold text-foreground print:text-black">{initialMetrics.productsCount}</p>
          </Link>
        </div>

        {/* Recharts Analytics Area */}
        <div className="border border-gray-200 p-6 rounded-lg shadow-sm print:shadow-none print:border-black">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-foreground print:text-black">
              Revenue Overview <span className="text-gray-400 text-sm font-normal ml-2">({timeRange === '7d' ? 'Daily' : 'Monthly'})</span>
            </h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={300}>
              {/* WE FEED THE ACTIVE DATA ARRAY INTO THE CHART HERE */}
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#000', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Grid: Low Stock, Best Sellers, & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:break-inside-avoid">
          {/* Low Stock Tracker */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden print:shadow-none print:border-black flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center print:bg-white print:border-black">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider print:text-black">Low Stock Alerts</h3>
            </div>
            <div className="divide-y divide-gray-200 print:divide-black flex-1 overflow-y-auto">
              {lowStock.length === 0 ? (
                <p className="p-6 text-sm text-gray-500">Inventory levels are healthy.</p>
              ) : (
                lowStock.map(product => (
                  <Link href={`/admin/products/${product.id}`} key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors block">
                    <div>
                      <p className="text-sm font-medium text-foreground print:text-black truncate pr-2">{product.title}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 print:border-black whitespace-nowrap">
                      {product.stock_count} left
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Best Sellers */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden print:shadow-none print:border-black flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2 print:bg-white print:border-black">
              <Award className="h-4 w-4 text-gray-500 print:text-black" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider print:text-black">Top Sellers</h3>
            </div>
            <div className="divide-y divide-gray-200 print:divide-black flex-1 overflow-y-auto">
              {bestSellers?.length === 0 ? (
                <p className="p-6 text-sm text-gray-500">No sales data yet.</p>
              ) : (
                bestSellers?.map((product) => (
                  <Link href={`/admin/products/${product.id}`} key={product.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors block">
                    {product.images?.[0]?.image_url ? (
                      <img src={product.images[0].image_url} alt={product.title} className="h-10 w-10 rounded object-cover border border-gray-200 flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-100 flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground print:text-black truncate">{product.title}</p>
                      <p className="text-xs text-gray-500 font-medium">₦{product.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground print:text-black">{product.total_sold}</span>
                      <span className="text-xs text-gray-500 block">Sold</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders Feed */}
          <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden print:shadow-none print:border-black flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center print:bg-white print:border-black">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider print:text-black">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-gray-200 print:divide-black flex-1 overflow-y-auto">
              {recentOrders.length === 0 ? (
                <p className="p-6 text-sm text-gray-500">No orders placed yet.</p>
              ) : (
                recentOrders.map(order => (
                  <Link href={`/admin/orders/${order.id}`} key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors block">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-sm font-medium text-foreground print:text-black truncate">
                        {order.customer?.name || order.customer?.email || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground print:text-black">₦{order.total_amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 capitalize">{order.status}</p>
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