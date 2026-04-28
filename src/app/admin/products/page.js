import { prisma } from '@/lib/prisma'
import { deleteProduct } from './actions'
import { Trash2, Edit } from 'lucide-react'
import CreateProductForm from './components/CreateProductForm'

export default async function ProductsPage() {
  // Fetch products, their collection, AND their primary image
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

  // Fetch collections for the dropdown
  const collections = await prisma.collection.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="max-w-6xl text-left">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Products</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: The Client Component Form */}
        <div className="lg:col-span-1">
          <CreateProductForm collections={collections} />
        </div>

        {/* Right Col: Server Rendered List */}
        <div className="lg:col-span-2">
          <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-left text-sm text-gray-500">No products found.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors text-left">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground flex items-center gap-3">
                        {product.images[0]?.image_url && (
                          <img src={product.images[0].image_url} alt={product.title} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                        )}
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-gray-500 text-xs">₦{product.price.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {product.is_published ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center">
                        <a href={`/admin/products/${product.id}`} className="text-gray-400 hover:text-foreground transition-colors">
                          <Edit className="h-4 w-4" />
                        </a>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button type="submit" className="text-red-500 hover:text-red-700 transition-colors pt-1">
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