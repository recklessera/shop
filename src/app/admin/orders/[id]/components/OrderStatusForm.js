'use client'

import { useState } from 'react'
import { updateOrderStatus } from '../../actions'

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
      // We don't need a success alert here because the Server Action revalidates the path, 
      // which will instantly visually update the page in the background!
    } catch (error) {
      alert(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <label htmlFor="status" className="text-sm font-medium text-gray-700">Update Fulfillment Status</label>
      <div className="flex items-center gap-3">
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-white"
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
          className="bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : 'Update'}
        </button>
      </div>
    </form>
  )
}