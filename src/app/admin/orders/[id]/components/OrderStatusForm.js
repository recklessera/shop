'use client'

import { useState } from 'react'
import { updateOrderStatus } from '../../actions'
import { RefreshCw, Truck, CheckCircle2 } from 'lucide-react'

export default function OrderStatusForm({ order }) {
  const [status, setStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccessMsg("")

    // Using e.target automatically grabs the hidden ID, the select status, and the text inputs
    const formData = new FormData(e.target)

    try {
      await updateOrderStatus(formData)
      setSuccessMsg("Fulfillment updated successfully!")
      setTimeout(() => setSuccessMsg(""), 5000) // Clear success message after 5 seconds
    } catch (error) {
      alert(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
      {/* Hidden input to pass the Order ID to the server action */}
      <input type="hidden" name="id" value={order.id} />

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Update Fulfillment
        </label>
        <div className="flex items-center gap-3">
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all cursor-pointer uppercase tracking-wider"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            type="submit" 
            disabled={isUpdating}
            className="bg-brand-gold text-white rounded-xl px-6 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Save'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* SMART SHIPPING FIELDS: Appears ONLY when 'shipped' is selected */}
      {status === "shipped" && (
        <div className="pt-4 mt-2 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-brand-gold" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">Dispatch Details for Email</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Courier / Service</label>
              <input 
                name="courier_name" 
                placeholder="e.g. GIG, DHL, Dispatch Rider" 
                defaultValue={order.courier_name || ""} 
                className="border border-gray-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink text-sm" 
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Tracking # / Phone</label>
              <input 
                name="tracking_number" 
                placeholder="Code or Rider's Phone" 
                defaultValue={order.tracking_number || ""} 
                className="border border-gray-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink text-sm" 
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Additional Notes (Optional)</label>
            <textarea 
              name="shipping_notes" 
              placeholder="e.g. Expected delivery in 3 days. Please have your ID ready..." 
              defaultValue={order.shipping_notes || ""} 
              rows="2" 
              className="border border-gray-200 bg-white rounded-lg px-3 py-2 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink text-sm resize-none"
            ></textarea>
          </div>
        </div>
      )}
    </form>
  )
}