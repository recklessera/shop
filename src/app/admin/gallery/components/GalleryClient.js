'use client'

import { useState } from 'react'
import { addGalleryImage, deleteGalleryImage } from '../actions'
import { Trash2, Plus, Image as ImageIcon, Tag } from 'lucide-react'

export default function GalleryClient({ initialImages }) {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  // Dynamically extract unique categories from the uploaded images
  const categories = ['All', ...new Set(initialImages.map(img => img.category).filter(Boolean))]

  const filteredImages = activeCategory === 'All' 
    ? initialImages 
    : initialImages.filter(img => img.category === activeCategory)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(file)
    // Generate browser preview for the UI
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    // Clear the file input visually
    const fileInput = document.getElementById('gallery_image')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!image) {
      alert("Please select an image to upload.")
      return
    }

    setIsSubmitting(true)
    
    // Hijack the form submit to ensure the file is appended correctly
    const formData = new FormData(e.target)
    formData.set('image', image)

    try {
      await addGalleryImage(formData)
      // Reset form on success
      e.target.reset()
      removeImage()
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full text-left">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lookbook Gallery</h1>
        <p className="text-sm font-medium text-gray-500">Manage campaign imagery, behind-the-scenes content, and brand assets.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Uploader Form */}
        <div className="lg:w-1/3">
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-lg">
                <ImageIcon className="h-5 w-5 text-brand-pink" />
              </div>
              Add to Gallery
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Native Image Upload & Preview */}
              <div>
                <label htmlFor="gallery_image" className="block text-sm font-bold text-gray-700 mb-2">Image <span className="text-brand-red">*</span></label>
                <input 
                  type="file" 
                  id="gallery_image"
                  name="image"
                  accept="image/*" 
                  required
                  onChange={handleImageChange}
                  className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-bold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20 border border-gray-200 rounded-xl mb-4 transition-all cursor-pointer" 
                />
                
                {imagePreview && (
                  <div className="relative cursor-pointer border border-gray-100 group w-full aspect-square bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                    <img src={imagePreview} alt="preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-brand-red text-gray-700 hover:text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category (Optional)</label>
                <input 
                  type="text" 
                  id="category"
                  name="category" 
                  list="category-list"
                  placeholder="e.g. campaign, behind-the-scenes"
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" 
                />
                <datalist id="category-list">
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="caption" className="block text-sm font-bold text-gray-700 mb-2">Caption (Optional)</label>
                <textarea 
                  id="caption"
                  name="caption" 
                  rows="3" 
                  placeholder="A brief description..."
                  className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all resize-none" 
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !image}
                  className="w-full bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? 'Uploading...' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Category Filters & Masonry Grid */}
        <div className="lg:w-2/3">
          
          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2.5 mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm ${
                    activeCategory === category 
                      ? 'bg-brand-pink text-white shadow-brand-pink/20' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {category === 'All' ? 'All Images' : category}
                </button>
              ))}
            </div>
          )}

          {/* Pure CSS Masonry Grid */}
          {filteredImages.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center shadow-sm">
              <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No images found in this category.</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {filteredImages.map((img) => (
                <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                  <img 
                    src={img.image_url} 
                    alt={img.caption || 'Gallery Image'} 
                    className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay - Soft Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <form action={deleteGalleryImage}>
                        <input type="hidden" name="id" value={img.id} />
                        <button type="submit" className="bg-white/20 hover:bg-brand-red text-white p-2 rounded-full backdrop-blur-md transition-colors" title="Delete Image">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                    
                    <div>
                      {img.category && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-white bg-brand-pink px-2.5 py-1 rounded-md mb-2 shadow-sm">
                          <Tag className="h-3 w-3" /> {img.category}
                        </span>
                      )}
                      {img.caption && (
                        <p className="text-sm text-white font-medium line-clamp-3 leading-relaxed drop-shadow-md">{img.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}