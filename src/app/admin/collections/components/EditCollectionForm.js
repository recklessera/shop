'use client'

import { useState } from 'react'
import { updateCollection } from '../actions'
import { Save, Image as ImageIcon } from 'lucide-react'

export default function EditCollectionForm({ collection }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverPreview, setCoverPreview] = useState(collection.cover_image_url)
  const [bannerPreview, setBannerPreview] = useState(collection.banner_image_url)

  const handleImageChange = (e, setPreview) => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    formData.append('id', collection.id)

    try {
      await updateCollection(formData)
      alert("Collection updated successfully!")
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Collection Title <span className="text-brand-red">*</span></label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          defaultValue={collection.title} 
          required 
          className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" 
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
        <textarea 
          id="description" 
          name="description" 
          defaultValue={collection.description || ''} 
          rows="4" 
          className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all resize-none" 
        />
      </div>

      <div className="pt-6 border-t border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image (Thumbnail)</label>
        <input 
          type="file" 
          name="cover_image" 
          accept="image/*"
          onChange={(e) => handleImageChange(e, setCoverPreview)}
          className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-bold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20 border border-gray-200 rounded-xl mb-4 transition-all cursor-pointer" 
        />
        {coverPreview ? (
          <img src={coverPreview} alt="Cover Preview" className="h-32 w-32 object-cover rounded-xl border border-gray-200 shadow-sm" />
        ) : (
          <div className="h-32 w-32 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-300" />
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-gray-100">
        <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image (Hero)</label>
        <input 
          type="file" 
          name="banner_image" 
          accept="image/*"
          onChange={(e) => handleImageChange(e, setBannerPreview)}
          className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-bold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20 border border-gray-200 rounded-xl mb-4 transition-all cursor-pointer" 
        />
        {bannerPreview ? (
          <img src={bannerPreview} alt="Banner Preview" className="h-32 w-full object-cover rounded-xl border border-gray-200 shadow-sm" />
        ) : (
          <div className="h-32 w-full bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">No Banner Image</span>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}