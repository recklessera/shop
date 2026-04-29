'use client'

import { Download, TrendingUp, Users, Package, DollarSign, Award, AlertTriangle } from 'lucide-react'

export default function AnalyticsClient({ metrics }) {
  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="text-left w-full print:bg-white print:text-black">
      
      {/* Header & Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Deep insights, customer behavior, and inventory health.</p>
        </div>
        <button 
          onClick={downloadPDF} 
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Printable Report Wrapper */}
      <div className="space-y-8 print:space-y-6">
        
        {/* SECTION 1: High-Level Performance */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 print:text-black">
            <TrendingUp className="h-5 w-5" /> Store Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Total Revenue" value={`₦${metrics.revenue.toLocaleString()}`} />
            <MetricCard title="Total Orders" value={metrics.totalOrders} />
            <MetricCard title="Average Order Value" value={`₦${metrics.averageOrderValue.toLocaleString()}`} />
            <MetricCard title="Items Sold" value={metrics.totalItemsSold} />
          </div>
        </div>

        <hr className="border-gray-200 print:border-black" />

        {/* SECTION 2: Customer Insights */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 print:text-black">
            <Users className="h-5 w-5" /> Customer Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* VIP Customers */}
            <div className="border border-gray-200 rounded-lg p-6 print:border-black">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-gray-500 print:text-black">
                <Award className="h-4 w-4" /> VIP Customers (Top Spenders)
              </h3>
              <div className="space-y-4">
                {metrics.topCustomers.map((user, idx) => (
                  <div key={user.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold w-4">{idx + 1}.</span>
                      <div>
                        <p className="text-sm font-medium text-foreground print:text-black">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500">{user.ordersCount} Orders</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-foreground print:text-black">₦{user.totalSpent.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="border border-gray-200 rounded-lg p-6 print:border-black">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-gray-500 print:text-black">
                <Package className="h-4 w-4" /> Best Selling Products
              </h3>
              <div className="space-y-4">
                {metrics.bestSellers.map((item, idx) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold w-4">{idx + 1}.</span>
                      <p className="text-sm font-medium text-foreground print:text-black">{item.title}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground print:text-black">{item.total_sold} units</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <hr className="border-gray-200 print:border-black" />

        {/* SECTION 3: Inventory Health */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 print:text-black">
            <Package className="h-5 w-5" /> Inventory Health
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Active Products" value={metrics.activeProductsCount} />
            <MetricCard title="Total Units in Stock" value={metrics.totalStockUnits} />
            <MetricCard title="Median Price" value={`₦${metrics.medianPrice.toLocaleString()}`} />
            <MetricCard title="Cheapest Item" value={`₦${metrics.cheapestItemPrice.toLocaleString()}`} />
          </div>

          <div className="border border-gray-200 rounded-lg p-6 print:border-black">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-red-600 print:text-black">
              <AlertTriangle className="h-4 w-4" /> Low Stock / Depleted Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.lowStockItems.length === 0 ? (
                <p className="text-sm text-gray-500">Inventory is healthy.</p>
              ) : (
                metrics.lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-2 print:border-black">
                    <p className="text-sm font-medium text-foreground truncate pr-4 print:text-black">{item.title}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${item.stock_count === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} print:bg-transparent print:border print:border-black`}>
                      {item.stock_count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// Helper component for the metric squares
function MetricCard({ title, value }) {
  return (
    <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 print:bg-white print:border-black">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 print:text-black">{title}</h3>
      <p className="text-2xl font-bold text-foreground print:text-black">{value}</p>
    </div>
  )
}