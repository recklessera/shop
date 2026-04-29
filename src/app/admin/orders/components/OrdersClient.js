'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Search, Filter, Download, Calendar } from 'lucide-react'

export default function OrdersClient({ initialOrders }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState('all') // NEW: Date range state

  // Real-time filtering logic
  const filteredOrders = initialOrders.filter(order => {
    // 1. Search Check
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())

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

  // Generate CSV from the *currently filtered* data
  const downloadCSV = () => {
    const headers = "Order ID,Date,Customer Name,Customer Email,Total Amount (NGN),Status,Item Count\n"
    const rows = filteredOrders.map(order => {
      const name = `"${order.customer?.name || 'Unknown'}"`
      const email = order.customer?.email || 'No Email'
      const date = new Date(order.created_at).toLocaleDateString()
      return `${order.id},${date},${name},${email},${order.total_amount},${order.status},${order._count.items}`
    }).join("\n")

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reckless-era-orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors bg-white font-medium shadow-sm rounded-md"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID, Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* NEW: Date Range Filter */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none appearance-none bg-white"
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:border-foreground focus:ring-1 focus:ring-foreground outline-none appearance-none bg-white"
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
      <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                    {initialOrders.length === 0 ? "No orders found." : "No orders match your search criteria."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      <div className="font-medium">{order.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{order.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      ₦{order.total_amount.toLocaleString()} <span className="text-xs font-normal">({order._count.items} items)</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-foreground hover:opacity-70 transition-opacity inline-flex items-center gap-1">
                        <Eye className="h-4 w-4" /> View
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