'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Search, Filter, Download, Calendar, ShoppingCart } from 'lucide-react'

export default function OrdersClient({ initialOrders }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState('all')

  // Real-time filtering logic
  const filteredOrders = initialOrders.filter(order => {
    const searchLower = searchTerm.toLowerCase()
    
    // 1. Search Check 
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) ||
      (order.customer?.name || '').toLowerCase().includes(searchLower) ||
      (order.customer?.email || '').toLowerCase().includes(searchLower) ||
      (order.phone_number || '').includes(searchLower) ||
      (order.customer?.phone_number || '').includes(searchLower)

    // 2. Status Check
    const matchesStatus = statusFilter === 'All' || order.status.toLowerCase() === statusFilter.toLowerCase()

    // 3. Date Range Check
    let matchesDate = true
    if (dateRange !== 'all') {
      const orderDate = new Date(order.created_at)
      const cutoffDate = new Date()
      
      if (dateRange === '7d') cutoffDate.setDate(cutoffDate.getDate() - 7)
      if (dateRange === '30d') cutoffDate.setDate(cutoffDate.getDate() - 30)
      if (dateRange === '90d') cutoffDate.setDate(cutoffDate.getDate() - 90)
      if (dateRange === '1y') cutoffDate.setFullYear(cutoffDate.getFullYear() - 1)
      
      matchesDate = orderDate >= cutoffDate
    }

    // Must pass all three filters to be displayed
    return matchesSearch && matchesStatus && matchesDate
  })

  // Generate CSV (UPDATED: Now extracts State, Shipping Method, and Shipping Cost)
  const downloadCSV = () => {
    const headers = "Order ID,Date,Customer Name,Customer Email,Customer Phone,State,Shipping Method,Shipping Cost (NGN),Total Amount (NGN),Status,Item Count\n"
    
    const rows = filteredOrders.map(order => {
      const name = `"${order.customer?.name || 'Guest'}"`
      const email = order.customer?.email || 'No Email'
      const phone = order.phone_number || order.customer?.phone_number || 'No Phone'
      const date = new Date(order.created_at).toLocaleDateString()
      
      // Parse shipping address safely
      let address = {}
      try {
        address = typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : (order.shipping_address || {})
      } catch (e) {
        address = {}
      }

      const state = address.state || 'N/A'
      const method = address.method || 'Standard'
      const shippingCost = address.cost !== undefined ? address.cost : 0
      
      return `${order.id},${date},${name},${email},${phone},${state},${method},${shippingCost},${order.total_amount},${order.status},${order._count.items}`
    }).join("\n")

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reckless-era-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Upgraded SaaS Status Colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-brand-gold/10 text-brand-gold-hover'
      case 'processing': return 'bg-brand-pink/10 text-brand-pink'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-brand-red/10 text-brand-red'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full text-left">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders Ledger</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Manage customer transactions, fulfillments, and financial history.</p>
        </div>
        
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-brand-gold text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 border border-gray-100 rounded-2xl shadow-sm mb-8 flex flex-col lg:flex-row gap-5">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID, Name, Email, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Date Range Filter */}
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-11 pr-8 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none appearance-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">All-Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Past Year</option>
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-11 pr-8 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none appearance-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-brand-pink" />
            Transaction History
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-50">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-gray-500">
                      {initialOrders.length === 0 ? "No orders found." : "No orders match your search criteria."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-extrabold font-mono text-gray-900 tracking-wider">
                      <span className="text-gray-400">#</span>{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors">{order.customer?.name || 'Guest'}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{order.customer?.email}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-extrabold text-gray-900">₦{order.total_amount.toLocaleString()}</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{order._count.items} items</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/orders/${order.id}`} 
                        className="inline-flex items-center gap-1.5 p-2 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
                      >
                        <Eye className="h-4 w-4" /> 
                        <span className="font-bold">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}