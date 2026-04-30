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
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Editorial Blog</h1>
        <p className="text-sm font-medium text-gray-500">Publish lookbook stories, campaign lore, and brand announcements.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Top Section: The Editor */}
        <div className="w-full">
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-lg">
                <FileText className="h-5 w-5 text-brand-pink" />
              </div>
              Write New Article
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Article Title <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    id="title"
                    name="title" 
                    required 
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="e.g. The Summer Lookbook"
                    className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" 
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-bold text-gray-700 mb-2">URL Slug <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    id="slug"
                    name="slug" 
                    required 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. the-summer-lookbook"
                    className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none bg-gray-50 transition-all" 
                  />
                </div>
              </div>

              {/* Native Image Upload & Preview */}
              <div>
                <label htmlFor="featured_image" className="block text-sm font-bold text-gray-700 mb-2">Featured Cover Image</label>
                <input 
                  type="file" 
                  id="featured_image"
                  name="image"
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-brand-pink hover:file:bg-brand-pink/10 border border-gray-200 rounded-xl mb-4 transition-all" 
                />
                
                {imagePreview && (
                  <div className="relative cursor-pointer border border-gray-100 group w-full max-w-md aspect-video bg-gray-50 rounded-xl shadow-sm overflow-hidden">
                    <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-brand-red text-gray-700 hover:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">Article Content (HTML / Markdown supported) <span className="text-brand-red">*</span></label>
                <textarea 
                  id="content"
                  name="content" 
                  required
                  rows="12" 
                  placeholder="Start writing..."
                  className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all resize-none" 
                />
              </div>

              <div className="flex items-center pt-2">
                <input 
                  type="checkbox" 
                  id="is_published" 
                  name="is_published" 
                  className="h-4 w-4 border-gray-300 rounded text-brand-pink focus:ring-brand-pink transition-all" 
                  defaultChecked 
                />
                <label htmlFor="is_published" className="ml-3 block text-sm text-gray-900 font-bold">Publish immediately</label>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? 'Saving Post...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section: Published Ledger */}
        <div className="w-full">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-pink" />
                Published Articles
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Date</th>
                    <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-sm font-medium text-gray-500">No blog posts written yet.</td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {blog.featured_image_url ? (
                              <img src={blog.featured_image_url} alt={blog.title} className="h-12 w-16 object-cover rounded-lg border border-gray-100 shadow-sm" />
                            ) : (
                              <div className="h-12 w-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors line-clamp-1">{blog.title}</p>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">/{blog.slug}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-md">
                              <User className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{blog.author?.name || blog.author?.email || 'Admin'}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 mb-1.5">
                            {blog.status === 'published' ? (
                              <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-brand-pink/10 text-brand-pink tracking-wider">Live</span>
                            ) : (
                              <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-gray-100 text-gray-600 tracking-wider">Draft</span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-gray-500 pl-1">
                            {blog.published_at 
                              ? new Date(blog.published_at).toLocaleDateString() 
                              : 'Not published'}
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 items-center pt-7">
                          {/* Toggle Status Form */}
                          <form action={toggleBlogStatus}>
                            <input type="hidden" name="id" value={blog.id} />
                            <input type="hidden" name="status" value={blog.status} />
                            <button type="submit" title={blog.status === 'published' ? "Unpublish to Draft" : "Publish to Live"} className={`p-2 rounded-lg transition-colors ${blog.status === 'published' ? 'text-brand-pink hover:bg-brand-pink/10' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'}`}>
                              {blog.status === 'published' ? <Globe className="h-4 w-4" /> : <GlobeLock className="h-4 w-4" />}
                            </button>
                          </form>

                          {/* Delete Form */}
                          <form action={deleteBlog}>
                            <input type="hidden" name="id" value={blog.id} />
                            <button type="submit" className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors" title="Delete Post">
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