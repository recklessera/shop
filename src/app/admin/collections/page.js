import { prisma } from '@/lib/prisma'
import { createCollection, deleteCollection } from './actions'
import { Trash2 } from 'lucide-react'

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
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Collections</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Create New Collection Form */}
        <div className="lg:col-span-1">
          <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-foreground mb-4">Add Collection</h3>
            <form action={createCollection} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., Summer Essentials"
                  className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Editorial description for SEO..."
                  className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image (Square)
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-foreground hover:file:bg-gray-100 border border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image (Landscape)
                </label>
                <input
                  type="file"
                  id="bannerImage"
                  name="bannerImage"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-foreground hover:file:bg-gray-100 border border-gray-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background py-2 text-sm font-semibold hover:opacity-90 transition-opacity mt-4"
              >
                Create Collection
              </button>
            </form>
          </div>
        </div>

        {/* Collections List */}
        <div className="lg:col-span-2">
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-gray-200">
                {collections.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                      No collections found. Create your first one to get started.
                    </td>
                  </tr>
                ) : (
                  collections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {collection.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        /{collection.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {collection._count.products}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <form action={deleteCollection}>
                          <input type="hidden" name="id" value={collection.id} />
                          <button 
                            type="submit"
                            className="text-red-500 hover:text-red-700 transition-colors"
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
  )
}