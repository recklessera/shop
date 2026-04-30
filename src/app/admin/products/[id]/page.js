import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit3, Image as ImageIcon } from 'lucide-react'
import EditProductForm from '../components/EditProductForm'

export default async function EditProductPage({ params }) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { is_primary: 'desc' }
      },
      variants: true
    }
  })

  if (!product) {
    notFound()
  }

  const collections = await prisma.collection.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="max-w-6xl mx-auto w-full text-left">
      
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm font-bold text-gray-500 hover:text-brand-pink flex items-center gap-2 transition-colors inline-flex px-3 py-2 -ml-3 rounded-lg hover:bg-brand-pink/5">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          Edit: {product.title}
        </h1>
        <p className="text-sm font-medium text-gray-500">Update product details, pricing, and inventory levels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        
        {/* Left Column: The Form */}
        <div>
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-lg">
                <Edit3 className="h-5 w-5 text-brand-pink" />
              </div>
              Product Details
            </h3>
            <EditProductForm product={product} collections={collections} />
          </div>
        </div>

        {/* Right Column: Existing Image Gallery */}
        <div>
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <ImageIcon className="h-5 w-5 text-brand-gold-hover" />
              </div>
              Current Gallery
            </h3>
            
            {product.images.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-12 text-center">
                <p className="text-sm font-medium text-gray-500">No images uploaded for this product.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((img) => (
                  <div key={img.id} className="relative border border-gray-100 rounded-xl overflow-hidden shadow-sm group bg-gray-50 aspect-square">
                    <img src={img.image_url} alt={img.alt_text || 'product'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {img.is_primary && (
                      <span className="absolute top-3 left-3 bg-brand-pink text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-md shadow-sm">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}