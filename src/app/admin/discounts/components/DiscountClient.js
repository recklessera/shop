'use client'

import { useState } from 'react'
import { createDiscountCode, toggleDiscountStatus, deleteDiscountCode } from '../actions'
import { Trash2, Power, PowerOff, Dices, Ticket, Plus } from 'lucide-react'

export default function DiscountClient({ discounts, collections }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeString, setCodeString] = useState('')

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCodeString(result)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target)
    try {
      await createDiscountCode(formData)
      e.target.reset()
      setCodeString('')
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full text-left">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Discount Engine</h1>
        <p className="text-sm font-medium text-gray-500">Generate and manage promotional campaigns, sales, and VIP codes.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Top Section: The Generator Form */}
        <div className="w-full">
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-lg">
                <Ticket className="h-5 w-5 text-brand-pink" />
              </div>
              Create New Code
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Core Settings */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Code Name <span className="text-brand-red">*</span></label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="code_string" 
                        value={codeString}
                        onChange={(e) => setCodeString(e.target.value.toUpperCase())}
                        required 
                        placeholder="e.g. SUMMER26"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none uppercase transition-all" 
                      />
                      <button 
                        type="button" 
                        onClick={generateRandomCode} 
                        className="px-4 py-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors shadow-sm" 
                        title="Generate Random"
                      >
                        <Dices className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Type <span className="text-brand-red">*</span></label>
                      <select name="discount_type" required className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all cursor-pointer">
                        <option value="PERCENT">Percentage</option>
                        <option value="FIXED">Fixed Amount (₦)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Value <span className="text-brand-red">*</span></label>
                      <input type="number" step="0.01" name="discount_value" required placeholder="e.g. 20" className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Limits & Expiration */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Spend (₦)</label>
                    <input type="number" step="0.01" name="min_order_value" placeholder="e.g. 50000" className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Usage Limit (Total uses)</label>
                    <input type="number" name="usage_limit" placeholder="e.g. 50" className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
                  </div>
                </div>

                {/* Targeting & Submit */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiration Date</label>
                    <input type="datetime-local" name="valid_until" className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Lock to Collection</label>
                    <select name="applicable_collection_id" className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all cursor-pointer">
                      <option value="">Apply to entire store</option>
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? 'Creating Code...' : 'Create Discount Code'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section: The Active Ledger */}
        <div className="w-full">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Dices className="h-4 w-4 text-brand-pink" />
                Active Campaigns
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code & Value</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {discounts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-sm font-medium text-gray-500">No discount codes generated.</td>
                    </tr>
                  ) : (
                    discounts.map((discount) => {
                      const isExpired = discount.valid_until && new Date(discount.valid_until) < new Date()
                      const isMaxedOut = discount.usage_limit && discount.times_used >= discount.usage_limit
                      const isUsable = discount.is_active && !isExpired && !isMaxedOut

                      return (
                        <tr key={discount.id} className={`transition-colors group ${!isUsable ? 'bg-gray-50/50 opacity-80' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-extrabold font-mono text-gray-900 tracking-wider group-hover:text-brand-pink transition-colors">{discount.code_string}</div>
                            <div className="text-xs font-bold text-brand-gold mt-1">
                              {discount.discount_type === 'PERCENT' ? `${discount.discount_value}% OFF` : `₦${discount.discount_value.toLocaleString()} OFF`}
                            </div>
                          </td>
                          
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{discount.times_used} uses</div>
                            {discount.usage_limit && (
                              <div className="w-full bg-gray-100 rounded-full h-2 mt-2 max-w-[120px] overflow-hidden">
                                <div className="bg-brand-pink h-full rounded-full transition-all" style={{ width: `${Math.min((discount.times_used / discount.usage_limit) * 100, 100)}%` }}></div>
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              {isExpired ? (
                                <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-brand-red/10 text-brand-red tracking-wider">Expired</span>
                              ) : isMaxedOut ? (
                                <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-gray-200 text-gray-600 tracking-wider">Limit Reached</span>
                              ) : discount.is_active ? (
                                <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-green-100 text-green-700 tracking-wider">Active</span>
                              ) : (
                                <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-gray-200 text-gray-500 tracking-wider">Disabled</span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 items-center pt-6">
                            {/* Toggle Status Form */}
                            <form action={toggleDiscountStatus}>
                              <input type="hidden" name="id" value={discount.id} />
                              <input type="hidden" name="is_active" value={discount.is_active.toString()} />
                              <button type="submit" title={discount.is_active ? "Disable Code" : "Activate Code"} className={`p-2 rounded-lg transition-colors ${discount.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}>
                                {discount.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                              </button>
                            </form>

                            {/* Delete Form */}
                            <form action={deleteDiscountCode}>
                              <input type="hidden" name="id" value={discount.id} />
                              <button type="submit" className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors" title="Delete Code">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}