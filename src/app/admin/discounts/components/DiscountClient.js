'use client'

import { useState } from 'react'
import { createDiscountCode, toggleDiscountStatus, deleteDiscountCode } from '../actions'
import { Trash2, Power, PowerOff, Dices } from 'lucide-react'

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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Discount Codes</h2>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Top Section: The Generator Form */}
        <div className="w-full">
          <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-foreground mb-4">Create New Code</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Core Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Name *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="code_string" 
                        value={codeString}
                        onChange={(e) => setCodeString(e.target.value.toUpperCase())}
                        required 
                        placeholder="e.g. SUMMER26"
                        className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none uppercase" 
                      />
                      <button type="button" onClick={generateRandomCode} className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded" title="Generate Random">
                        <Dices className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select name="discount_type" required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-white">
                        <option value="PERCENT">Percentage</option>
                        <option value="FIXED">Fixed Amount (₦)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                      <input type="number" step="0.01" name="discount_value" required placeholder="e.g. 20" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Limits & Expiration */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (₦)</label>
                    <input type="number" step="0.01" name="min_order_value" placeholder="e.g. 50000" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Total uses)</label>
                    <input type="number" name="usage_limit" placeholder="e.g. 50" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
                  </div>
                </div>

                {/* Targeting & Submit */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input type="datetime-local" name="valid_until" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lock to Collection</label>
                    <select name="applicable_collection_id" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-white">
                      <option value="">Apply to entire store</option>
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-foreground text-background px-8 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Discount Code'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section: The Active Ledger */}
        <div className="w-full">
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code & Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200">
                  {discounts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">No discount codes generated.</td>
                    </tr>
                  ) : (
                    discounts.map((discount) => {
                      const isExpired = discount.valid_until && new Date(discount.valid_until) < new Date()
                      const isMaxedOut = discount.usage_limit && discount.times_used >= discount.usage_limit
                      const isUsable = discount.is_active && !isExpired && !isMaxedOut

                      return (
                        <tr key={discount.id} className={`transition-colors ${!isUsable ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold font-mono text-foreground">{discount.code_string}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {discount.discount_type === 'PERCENT' ? `${discount.discount_value}% OFF` : `₦${discount.discount_value.toLocaleString()} OFF`}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{discount.times_used} uses</div>
                            {discount.usage_limit && (
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 max-w-[100px]">
                                <div className="bg-foreground h-1.5 rounded-full" style={{ width: `${Math.min((discount.times_used / discount.usage_limit) * 100, 100)}%` }}></div>
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {isExpired ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">Expired</span>
                            ) : isMaxedOut ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-800">Limit Reached</span>
                            ) : discount.is_active ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Active</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-800">Disabled</span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center pt-5">
                            {/* Toggle Status Form */}
                            <form action={toggleDiscountStatus}>
                              <input type="hidden" name="id" value={discount.id} />
                              <input type="hidden" name="is_active" value={discount.is_active.toString()} />
                              <button type="submit" title={discount.is_active ? "Disable Code" : "Activate Code"} className={`${discount.is_active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                                {discount.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                              </button>
                            </form>

                            {/* Delete Form */}
                            <form action={deleteDiscountCode}>
                              <input type="hidden" name="id" value={discount.id} />
                              <button type="submit" className="text-red-500 hover:text-red-700 transition-colors">
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