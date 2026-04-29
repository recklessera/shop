'use client'

import { useState } from 'react'
import { createBlog, toggleBlogStatus, deleteBlog } from '../actions'
import { Trash2, Plus, FileText, Globe, GlobeLock, User } from 'lucide-react'

export default function BlogClient({ blogs }) {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    const fileInput = document.getElementById('featured_image')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.target)
    if (image) formData.set('image', image)

    try {
      await createBlog(formData)
      e.target.reset()
      setTitle('')
      setSlug('')
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
        <h2 className="text-2xl font-bold text-foreground">Editorial Blog</h2>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Top Section: The Editor */}
        <div className="w-full">
          <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-foreground mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Write New Article
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Article Title *</label>
                  <input 
                    type="text" 
                    id="title"
                    name="title" 
                    required 
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="e.g. The Summer Lookbook"
                    className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" 
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                  <input 
                    type="text" 
                    id="slug"
                    name="slug" 
                    required 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. the-summer-lookbook"
                    className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none bg-gray-50" 
                  />
                </div>
              </div>

              {/* Native Image Upload & Preview */}
              <div>
                <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">Featured Cover Image</label>
                <input 
                  type="file" 
                  id="featured_image"
                  name="image"
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-foreground hover:file:bg-gray-100 border border-gray-300 mb-4" 
                />
                
                {imagePreview && (
                  <div className="relative cursor-pointer border-2 border-transparent group w-full max-w-md aspect-video bg-gray-50">
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
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Article Content (HTML / Markdown supported) *</label>
                <textarea 
                  id="content"
                  name="content" 
                  required
                  rows="12" 
                  placeholder="Start writing..."
                  className="block w-full border border-gray-300 px-4 py-3 text-sm focus:border-foreground focus:outline-none" 
                />
              </div>

              <div className="flex items-center pt-2">
                <input type="checkbox" id="is_published" name="is_published" className="h-4 w-4 border-gray-300 rounded text-foreground focus:ring-foreground" defaultChecked />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900 font-medium">Publish immediately</label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-foreground text-background px-8 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section: Published Ledger */}
        <div className="w-full">
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status & Date</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">No blog posts written yet.</td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {blog.featured_image_url ? (
                              <img src={blog.featured_image_url} alt={blog.title} className="h-12 w-16 object-cover rounded border border-gray-200" />
                            ) : (
                              <div className="h-12 w-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground line-clamp-1">{blog.title}</p>
                              <p className="text-xs text-gray-500">/{blog.slug}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{blog.author?.name || blog.author?.email || 'Admin'}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 mb-1">
                            {blog.status === 'published' ? (
                              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-green-100 text-green-800 tracking-wider">Live</span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-yellow-100 text-yellow-800 tracking-wider">Draft</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {blog.published_at 
                              ? new Date(blog.published_at).toLocaleDateString() 
                              : 'Not published'}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center pt-6">
                          {/* Toggle Status Form */}
                          <form action={toggleBlogStatus}>
                            <input type="hidden" name="id" value={blog.id} />
                            <input type="hidden" name="status" value={blog.status} />
                            <button type="submit" title={blog.status === 'published' ? "Unpublish to Draft" : "Publish to Live"} className={`${blog.status === 'published' ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                              {blog.status === 'published' ? <Globe className="h-4 w-4" /> : <GlobeLock className="h-4 w-4" />}
                            </button>
                          </form>

                          {/* Delete Form */}
                          <form action={deleteBlog}>
                            <input type="hidden" name="id" value={blog.id} />
                            <button type="submit" className="text-red-500 hover:text-red-700 transition-colors" title="Delete Post">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
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