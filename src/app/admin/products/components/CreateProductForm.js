'use client'

import { useState } from 'react'
import { createProduct } from '../actions'
import { Plus, PackagePlus, X, Dices, Trash2 } from 'lucide-react'

export default function CreateProductForm({ collections }) {
  // NEW: Added price to the default object
  const [variants, setVariants] = useState([
    { id: Date.now(), size: '', color: '', sku: '', stock_count: 0, price: '' }
  ])
  
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), size: '', color: '', sku: '', stock_count: 0, price: '' }])
  }

  const removeVariant = (idToRemove) => {
    if (variants.length === 1) return 
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setImages(prev => [...prev, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove))
    if (primaryIndex === indexToRemove) setPrimaryIndex(0)
    if (primaryIndex > indexToRemove) setPrimaryIndex(prev => prev - 1)
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
    images.forEach(file => formData.append('images', file))
    formData.append('primaryIndex', primaryIndex)
    formData.append('variants', JSON.stringify(variants))

    try {
      await createProduct(formData)
      e.target.reset()
      setImages([])
      setImagePreviews([])
      setPrimaryIndex(0)
      setVariants([{ id: Date.now(), size: '', color: '', sku: '', stock_count: 0, price: '' }])
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm text-left sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-brand-pink/10 rounded-lg">
          <PackagePlus className="h-5 w-5 text-brand-pink" />
        </div>
        Add New Product
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-brand-red">*</span></label>
            <input type="text" id="title" name="title" required className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Base Price (₦) <span className="text-brand-red">*</span></label>
              <input type="number" step="0.01" id="price" name="price" required className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
            </div>
            <div>
              <label htmlFor="collection_id" className="block text-sm font-bold text-gray-700 mb-2">Collection <span className="text-brand-red">*</span></label>
              <select id="collection_id" name="collection_id" required defaultValue="" className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-white transition-all cursor-pointer">
                <option value="" disabled>Select a collection...</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>{collection.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-brand-red">*</span></label>
            <textarea id="description" name="description" required rows="4" className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all resize-none" />
          </div>
        </div>

        {/* Variants Manager */}
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
                
                {/* NEW: Upgraded to md:grid-cols-5 */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Size</label>
                    <input 
                      type="text" 
                      placeholder="e.g. M, L, OS" 
                      value={variant.size}
                      onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                      className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none transition-all" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Color</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Black" 
                      value={variant.color}
                      onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                      className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:border-brand-pink focus:outline-none transition-all" 
                    />
                  </div>

                  {/* NEW: Optional Price Override */}
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

        <div className="pt-6 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange}
            className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-bold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20 border border-gray-200 rounded-xl mb-4 transition-all cursor-pointer" 
          />
          
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {imagePreviews.map((src, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setPrimaryIndex(idx)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden group aspect-square bg-gray-50 transition-all ${primaryIndex === idx ? 'ring-2 ring-brand-pink ring-offset-2' : 'border border-gray-200 hover:border-brand-pink/50'}`}
                >
                  <img src={src} alt="preview" className="h-full w-full object-cover" />
                  {primaryIndex === idx && (
                    <div className="absolute top-2 left-2 bg-brand-pink text-white text-[10px] uppercase font-extrabold px-2 py-1 rounded shadow-sm">Primary</div>
                  )}
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    className="absolute top-2 right-2 bg-white/90 text-gray-700 hover:bg-brand-red hover:text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" id="is_published" name="is_published" className="h-4 w-4 border-gray-300 rounded text-brand-pink focus:ring-brand-pink transition-all" defaultChecked />
          <label htmlFor="is_published" className="ml-3 block text-sm text-gray-900 font-bold">Publish immediately</label>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? 'Uploading & Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}