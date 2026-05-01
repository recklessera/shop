'use client'

import { Download, TrendingUp, Users, Package, Award, AlertTriangle } from 'lucide-react'

export default function AnalyticsClient({ metrics }) {
  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="text-left w-full print:bg-white print:text-black">
      
      {/* Header & Export Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Deep insights, customer behavior, and inventory health.</p>
        </div>
        <button 
          onClick={downloadPDF} 
          className="flex items-center gap-2 bg-brand-gold text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20"
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* Printable Report Wrapper */}
      <div className="space-y-10 print:space-y-8">
        
        {/* SECTION 1: High-Level Performance */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 print:text-black">
            <div className="p-2 bg-brand-pink/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-brand-pink" />
            </div>
            Store Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Revenue" value={`₦${metrics.revenue.toLocaleString()}`} />
            <MetricCard title="Total Orders" value={metrics.totalOrders} />
            <MetricCard title="Avg Order Value" value={`₦${metrics.averageOrderValue.toLocaleString()}`} />
            <MetricCard title="Items Sold" value={metrics.totalItemsSold} />
          </div>
        </div>

        <hr className="border-gray-200 print:border-black" />

        {/* SECTION 2: Customer Insights */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 print:text-black">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-5 w-5 text-gray-700" />
            </div>
            Customer Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* VIP Customers */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 print:border-black print:shadow-none">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-gray-900 print:text-black">
                <Award className="h-5 w-5 text-brand-gold" /> VIP Customers
              </h3>
              <div className="space-y-4">
                {metrics.topCustomers.map((user, idx) => (
                  <div key={user.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <span className="text-brand-gold font-extrabold w-4">{idx + 1}.</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900 print:text-black group-hover:text-brand-pink transition-colors">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.ordersCount} Orders</p>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900 print:text-black">₦{user.totalSpent.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 print:border-black print:shadow-none">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-gray-900 print:text-black">
                <Package className="h-5 w-5 text-brand-pink" /> Best Selling Products
              </h3>
              <div className="space-y-4">
                {metrics.bestSellers.map((item, idx) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <span className="text-brand-pink font-extrabold w-4">{idx + 1}.</span>
                      <p className="text-sm font-bold text-gray-900 print:text-black group-hover:text-brand-pink transition-colors truncate pr-4">{item.title}</p>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900 print:text-black whitespace-nowrap">{item.total_sold} units</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <hr className="border-gray-200 print:border-black" />

        {/* SECTION 3: Inventory Health */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 print:text-black">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Package className="h-5 w-5 text-gray-700" />
            </div>
            Inventory Health
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Active Products" value={metrics.activeProductsCount} />
            <MetricCard title="Units in Stock" value={metrics.totalStockUnits} />
            <MetricCard title="Median Price" value={`₦${metrics.medianPrice.toLocaleString()}`} />
            <MetricCard title="Cheapest Item" value={`₦${metrics.cheapestItemPrice.toLocaleString()}`} />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 print:border-black print:shadow-none">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-brand-red print:text-black">
              <AlertTriangle className="h-5 w-5" /> Low Stock / Depleted Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {metrics.lowStockItems.length === 0 ? (
                <p className="text-sm font-medium text-gray-500">Inventory is healthy.</p>
              ) : (
                metrics.lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-3 print:border-black">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-bold text-gray-900 truncate print:text-black">{item.product?.title || 'Unknown Product'}</p>
                      {(item.size || item.color) && (
                        <p className="text-[10px] uppercase font-bold text-gray-500 mt-0.5 tracking-wider">
                          {[item.size, item.color].filter(Boolean).join(' / ')}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${item.stock_count === 0 ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-gold/10 text-brand-gold-hover'} print:bg-transparent print:border print:border-black`}>
                      {item.stock_count} left
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

// Upgraded helper component for the metric squares
function MetricCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-pink/20 hover:-translate-y-1 transition-all duration-300 print:bg-white print:border-black print:shadow-none">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 print:text-black">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900 print:text-black">{value}</p>
    </div>
  )
}