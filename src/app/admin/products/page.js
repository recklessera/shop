import { prisma } from '@/lib/prisma'
import { deleteProduct } from './actions'
import { Trash2, Edit, Package, Layers, ChevronLeft, ChevronRight } from 'lucide-react'
import CreateProductForm from './components/CreateProductForm'
import ProductFormToggle from './components/ProductFormToggle'
import Link from 'next/link'

export default async function ProductsPage({ searchParams }) {
  // 1. Pagination Setup
  const params = await searchParams
  const currentPage = Number(params?.page) || 1
  const ITEMS_PER_PAGE = 8 // Show 8 items per page

  const totalProducts = await prisma.product.count()
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  // 2. Fetch data with Skip/Take for pagination, and include variants for accurate stock
  const products = await prisma.product.findMany({
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { title: 'asc' },
    include: {
      collection: { select: { title: true } },
      variants: { select: { stock_count: true } }, 
      images: {
        where: { is_primary: true },
        take: 1
      }
    }
  })

  // Calculate total stock per product from its variants
  const formattedProducts = products.map(product => {
    const totalStock = product.variants ? product.variants.reduce((sum, v) => sum + v.stock_count, 0) : 0
    return { ...product, totalStock }
  })

  const collections = await prisma.collection.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="max-w-4xl mx-auto w-full text-left">
      <div className="mb-10 flex flex-col gap-1 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Inventory</h1>
        <p className="text-sm font-medium text-gray-500">Manage your catalog, stock levels, and store visibility.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* TOP: The Form wrapped in our new expanding Pill Button */}
        <div className="w-full border-b border-gray-100 pb-8">
          <ProductFormToggle>
            <CreateProductForm collections={collections} />
          </ProductFormToggle>
        </div>

        {/* BOTTOM: Server Rendered List */}
        <div className="w-full">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-pink" />
                Active Roster
              </h3>
            </div>

            {/* Stacked Product List */}
            <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
              {formattedProducts.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                  <Package className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-sm font-medium text-gray-500">No products found in the database.</p>
                </div>
              ) : (
                formattedProducts.map((product) => (
                  <div key={product.id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group">
                    
                    {/* 1. Image Area */}
                    <div className="flex-shrink-0">
                      {product.images[0]?.image_url ? (
                        <img src={product.images[0].image_url} alt={product.title} className="h-14 w-14 rounded-xl object-cover border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* 2. Content Area */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-brand-pink transition-colors truncate pr-4">
                        {product.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs font-extrabold text-brand-gold">₦{product.price.toLocaleString()}</span>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs font-medium text-gray-500">SKU: {product.sku}</span>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className={`inline-flex items-center justify-center leading-none text-xs font-bold px-2 py-1 rounded-md ${product.totalStock <= 5 ? 'bg-brand-red/10 text-brand-red' : 'bg-gray-100 text-gray-700'}`}>
                          {product.totalStock} in stock
                        </span>
                      </div>
                    </div>

                    {/* 3. Actions & Status Area */}
                    <div className="pt-3 sm:pt-0 border-t border-gray-100 sm:border-t-0 flex-shrink-0 flex items-center gap-3 sm:justify-end mt-2 sm:mt-0">
                      
                      {product.is_published ? (
                        <span className="px-2.5 py-1 inline-flex items-center justify-center text-[10px] leading-none uppercase tracking-wider font-extrabold rounded-md bg-green-100 text-green-700 mr-2">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 inline-flex items-center justify-center text-[10px] leading-none uppercase tracking-wider font-extrabold rounded-md bg-gray-100 text-gray-600 mr-2">Draft</span>
                      )}

                      <Link href={`/admin/products/${product.id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:text-brand-pink hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all">
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <form action={deleteProduct} className="flex-shrink-0">
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="p-2 border border-gray-200 text-gray-400 bg-white hover:text-brand-red hover:bg-brand-red/10 hover:border-brand-red/30 rounded-lg transition-colors flex items-center justify-center">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
                <p className="text-xs font-medium text-gray-500">
                  Showing <span className="font-bold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)}</span> of <span className="font-bold text-gray-900">{totalProducts}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`?page=${currentPage - 1}`} 
                    className={`p-1.5 border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                  <Link 
                    href={`?page=${currentPage + 1}`} 
                    className={`p-1.5 border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}