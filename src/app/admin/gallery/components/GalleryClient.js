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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Lookbook Gallery</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Uploader Form */}
        <div className="lg:w-1/3">
          <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm sticky top-8">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Add to Gallery
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Native Image Upload & Preview */}
              <div>
                <label htmlFor="gallery_image" className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                <input 
                  type="file" 
                  id="gallery_image"
                  name="image"
                  accept="image/*" 
                  required
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-foreground hover:file:bg-gray-100 border border-gray-300 mb-4" 
                />
                
                {imagePreview && (
                  <div className="relative cursor-pointer border-2 border-transparent group w-full aspect-square bg-gray-50">
                    <img src={imagePreview} alt="preview" className="h-full w-full object-cover rounded" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category (Optional)</label>
                <input 
                  type="text" 
                  id="category"
                  name="category" 
                  list="category-list"
                  placeholder="e.g. campaign, behind-the-scenes"
                  className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" 
                />
                <datalist id="category-list">
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional)</label>
                <textarea 
                  id="caption"
                  name="caption" 
                  rows="3" 
                  placeholder="A brief description..."
                  className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none resize-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !image}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-2 text-sm font-semibold hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {isSubmitting ? 'Uploading & Publishing...' : 'Upload Image'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Category Filters & Masonry Grid */}
        <div className="lg:w-2/3">
          
          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    activeCategory === category 
                      ? 'bg-foreground text-background' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'All' ? 'All Images' : category}
                </button>
              ))}
            </div>
          )}

          {/* Pure CSS Masonry Grid */}
          {filteredImages.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              No images found in this category.
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {filteredImages.map((img) => (
                <div key={img.id} className="break-inside-avoid relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img 
                    src={img.image_url} 
                    alt={img.caption || 'Gallery Image'} 
                    className="w-full h-auto block object-cover" 
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <form action={deleteGalleryImage}>
                        <input type="hidden" name="id" value={img.id} />
                        <button type="submit" className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors" title="Delete Image">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                    
                    <div>
                      {img.category && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-white bg-white/20 px-2 py-1 rounded backdrop-blur-sm mb-2">
                          <Tag className="h-3 w-3" /> {img.category}
                        </span>
                      )}
                      {img.caption && (
                        <p className="text-sm text-white font-medium line-clamp-3">{img.caption}</p>
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