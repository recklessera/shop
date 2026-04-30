'use client'

import { useState } from 'react'
import { updateProduct } from '../actions'
import { Save, Plus, Trash2, Dices } from 'lucide-react'

export default function EditProductForm({ product, collections }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [variants, setVariants] = useState(
    product.variants && product.variants.length > 0 
      ? product.variants 
      : [{ id: Date.now(), size: '', color: '', sku: product.sku || '', stock_count: product.stock_count || 0, price: '' }]
  )

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), size: '', color: '', sku: '', stock_count: 0, price: '' }])
  }

  const removeVariant = (idToRemove) => {
    if (variants.length === 1) {
      alert("A product must have at least one variant.")
      return
    }
    setVariants(variants.filter(v => v.id !== idToRemove))
  }

  const updateVariant = (id, field, value) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  const generateVariantSKU = (id) => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
    updateVariant(id, 'sku', `RE-${randomStr}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const missingSkus = variants.some(v => !v.sku.trim())
    if (missingSkus) {
      alert("All variants must have a SKU.")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.target)
    formData.append('id', product.id)
    formData.append('variants', JSON.stringify(variants))

    try {
      await updateProduct(formData)
      alert("Product updated successfully!")
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left">
      
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-brand-red">*</span></label>
          <input type="text" id="title" name="title" defaultValue={product.title} required className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Base Price (₦) <span className="text-brand-red">*</span></label>
            <input type="number" step="0.01" id="price" name="price" defaultValue={product.price} required className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="collection_id" className="block text-sm font-bold text-gray-700 mb-2">Collection <span className="text-brand-red">*</span></label>
            <select id="collection_id" name="collection_id" defaultValue={product.collection_id} required className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all cursor-pointer">
              <option value="" disabled>Select a collection...</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>{collection.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-brand-red">*</span></label>
          <textarea id="description" name="description" defaultValue={product.description} required rows="5" className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all resize-none" />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Inventory & Variants</h4>
          <button 
            type="button" 
            onClick={addVariant}
            className="text-xs font-bold text-brand-pink hover:text-brand-pink/80 flex items-center gap-1 bg-brand-pink/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Variant
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={variant.id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl relative group">
              {variants.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeVariant(variant.id)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-400 hover:text-brand-red p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g. M, L, OS" 
                    value={variant.size || ''}
                    onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                    className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Color</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Black" 
                    value={variant.color || ''}
                    onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                    className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1" title="Leave blank to use base price">Price (Opt)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Override (₦)" 
                    value={variant.price || ''}
                    onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                    className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock <span className="text-brand-red">*</span></label>
                  <input 
                    type="number" 
                    required 
                    value={variant.stock_count}
                    onChange={(e) => updateVariant(variant.id, 'stock_count', parseInt(e.target.value) || 0)}
                    className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">SKU <span className="text-brand-red">*</span></label>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      required 
                      value={variant.sku}
                      onChange={(e) => updateVariant(variant.id, 'sku', e.target.value.toUpperCase())}
                      placeholder="SKU" 
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none uppercase transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={() => generateVariantSKU(variant.id)}
                      className="px-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                      title="Auto-Generate SKU"
                    >
                      <Dices className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center pt-2">
        <input type="checkbox" id="is_published" name="is_published" defaultChecked={product.is_published} className="h-4 w-4 border-gray-300 rounded text-brand-pink focus:ring-brand-pink transition-all" />
        <label htmlFor="is_published" className="ml-3 block text-sm text-gray-900 font-bold">Publish immediately</label>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}