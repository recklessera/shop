'use client'

import { useState } from 'react'
import { updateProduct } from '../actions'

export default function EditProductForm({ product, collections }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    // Manually append the ID so the server action knows which product to update
    formData.append('id', product.id)

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
    <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm text-left">
      <h3 className="text-lg font-medium text-foreground mb-4">Edit Product Specs</h3>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" id="title" name="title" defaultValue={product.title} required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input type="text" id="sku" name="sku" defaultValue={product.sku} required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none uppercase" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
            <input type="number" step="0.01" id="price" name="price" defaultValue={product.price} required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label htmlFor="stock_count" className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input type="number" id="stock_count" name="stock_count" defaultValue={product.stock_count} required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="collection_id" className="block text-sm font-medium text-gray-700 mb-1">Collection *</label>
          <select id="collection_id" name="collection_id" defaultValue={product.collection_id} required className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-white">
            <option value="" disabled>Select a collection...</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>{collection.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea id="description" name="description" defaultValue={product.description} required rows="5" className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none resize-none" />
        </div>

        <div className="flex items-center mt-2">
          <input type="checkbox" id="is_published" name="is_published" defaultChecked={product.is_published} className="h-4 w-4 border-gray-300" />
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Publish immediately</label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-foreground text-background py-2 text-sm font-semibold hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}