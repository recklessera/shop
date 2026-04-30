import { prisma } from '@/lib/prisma'
import { deleteProduct } from './actions'
import { Trash2, Edit, Package, Layers } from 'lucide-react'
import CreateProductForm from './components/CreateProductForm'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { title: 'asc' },
    include: {
      collection: { select: { title: true } },
      images: {
        where: { is_primary: true },
        take: 1
      }
    }
  })

  const collections = await prisma.collection.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="max-w-7xl mx-auto w-full text-left">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Inventory</h1>
        <p className="text-sm font-medium text-gray-500">Manage your catalog, stock levels, and store visibility.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: The Client Component Form */}
        <div className="xl:col-span-1">
          <CreateProductForm collections={collections} />
        </div>

        {/* Right Col: Server Rendered List */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-pink" />
                Active Roster
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-gray-500">No products found in the database.</td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            {product.images[0]?.image_url ? (
                              <img src={product.images[0].image_url} alt={product.title} className="h-12 w-12 rounded-xl object-cover border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors truncate pr-4">{product.title}</div>
                              <div className="text-xs font-bold text-brand-gold mt-1">₦{product.price.toLocaleString()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{product.sku}</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`text-sm font-bold ${product.stock_count <= 5 ? 'text-brand-red' : 'text-gray-900'}`}>
                            {product.stock_count}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm">
                          {product.is_published ? (
                            <span className="px-3 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full bg-green-100 text-green-700">Active</span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full bg-gray-100 text-gray-600">Draft</span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 items-center pt-8">
                          <Link href={`/admin/products/${product.id}`} className="p-2 text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <button type="submit" className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors">
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