'use client'

import { useState } from 'react'
import { createProduct } from '../actions'

export default function CreateProductForm({ collections }) {
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setImages(prev => [...prev, ...files])
    
    // Generate browser previews for the UI
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
    setIsSubmitting(true)

    // Hijack the form submit to manually append the file array
    const formData = new FormData(e.target)
    images.forEach(file => formData.append('images', file))
    formData.append('primaryIndex', primaryIndex)

    try {
      await createProduct(formData)
      // Reset form on success
      e.target.reset()
      setImages([])
      setImagePreviews([])
      setPrimaryIndex(0)
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm text-left">
      <h3 className="text-lg font-medium text-foreground mb-4">Add Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" id="title" name="title" required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input type="text" id="sku" name="sku" required placeholder="e.g. TEE-BLK-M" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none uppercase" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
            <input type="number" step="0.01" id="price" name="price" required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label htmlFor="stock_count" className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input type="number" id="stock_count" name="stock_count" required defaultValue="0" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="collection_id" className="block text-sm font-medium text-gray-700 mb-1">Collection *</label>
          <select id="collection_id" name="collection_id" required defaultValue="" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-white">
            <option value="" disabled>Select a collection...</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>{collection.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea id="description" name="description" required rows="3" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none resize-none" />
        </div>

        {/* Multi-Image Upload & Gallery Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-foreground hover:file:bg-gray-100 border border-gray-300 mb-4" 
          />
          
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((src, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setPrimaryIndex(idx)}
                  className={`relative cursor-pointer border-2 group ${primaryIndex === idx ? 'border-foreground' : 'border-transparent'}`}
                >
                  <img src={src} alt="preview" className="h-24 w-full object-cover" />
                  {primaryIndex === idx && (
                    <div className="absolute top-0 left-0 bg-foreground text-background text-[10px] uppercase font-bold px-1 m-1">Primary</div>
                  )}
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center mt-2">
          <input type="checkbox" id="is_published" name="is_published" className="h-4 w-4 border-gray-300" />
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Publish immediately</label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-foreground text-background py-2 text-sm font-semibold hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading & Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}