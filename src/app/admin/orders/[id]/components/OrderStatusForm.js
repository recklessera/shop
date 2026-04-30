'use client'

import { useState } from 'react'
import { updateOrderStatus } from '../../actions'
import { RefreshCw } from 'lucide-react'

export default function OrderStatusForm({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    const formData = new FormData()
    formData.append('id', orderId)
    formData.append('status', status)

    try {
      await updateOrderStatus(formData)
    } catch (error) {
      alert(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      <label htmlFor="status" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Fulfillment</label>
      <div className="flex items-center gap-3">
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button 
          type="submit" 
          disabled={isUpdating || status === currentStatus}
          className="bg-brand-gold text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Update'}
        </button>
      </div>
    </form>
  )
}