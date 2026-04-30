import { prisma } from '@/lib/prisma'
import { createCollection, deleteCollection } from './actions'
import { Trash2, FolderTree, Tags, Plus, Edit } from 'lucide-react'
import Link from 'next/link'

export default async function CollectionsPage() {
  // Fetch all collections directly from the database
  const collections = await prisma.collection.findMany({
    orderBy: { title: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  })

  return (
    <div className="max-w-7xl mx-auto w-full text-left">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Collections</h1>
        <p className="text-sm font-medium text-gray-500">Organize your inventory into distinct product lines and seasonal drops.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create New Collection Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-lg">
                <FolderTree className="h-5 w-5 text-brand-pink" />
              </div>
              Add Collection
            </h3>
            
            <form action={createCollection} className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                  Collection Title <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., Summer Essentials"
                  className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Editorial description for SEO..."
                  className="block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-bold text-gray-700 mb-2">
                  Cover Image (Square)
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-brand-pink hover:file:bg-brand-pink/10 border border-gray-200 rounded-xl transition-all"
                />
              </div>

              <div>
                <label htmlFor="bannerImage" className="block text-sm font-bold text-gray-700 mb-2">
                  Banner Image (Landscape)
                </label>
                <input
                  type="file"
                  id="bannerImage"
                  name="bannerImage"
                  accept="image/*"
                  className="block w-full text-sm font-medium text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-brand-pink hover:file:bg-brand-pink/10 border border-gray-200 rounded-xl transition-all"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="w-full bg-brand-gold text-white rounded-xl px-8 py-3 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 flex justify-center items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Collections List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Tags className="h-4 w-4 text-brand-pink" />
                Active Collections
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {collections.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                        No collections found. Create your first one to get started.
                      </td>
                    </tr>
                  ) : (
                    collections.map((collection) => (
                      <tr key={collection.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors">
                          {collection.title}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-xs font-medium text-gray-500">
                          /{collection.slug}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="px-3 py-1 text-[10px] uppercase font-bold rounded-full bg-brand-pink/10 text-brand-pink tracking-wider">
                            {collection._count.products} Items
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 items-center">
                          <Link 
                            href={`/admin/collections/${collection.id}`} 
                            className="p-2 text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-lg transition-colors"
                            title="Edit Collection"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <form action={deleteCollection}>
                            <input type="hidden" name="id" value={collection.id} />
                            <button 
                              type="submit"
                              className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
                              title="Delete Collection"
                            >
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