import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditProductForm from '../components/EditProductForm'

export default async function EditProductPage({ params }) {
 const { id } = await params

  // 1. Fetch the specific product
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { is_primary: 'desc' }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // 2. Fetch collections for the dropdown
  const collections = await prisma.collection.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  return (
    <div className="max-w-4xl text-left">
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-foreground flex items-center gap-2 transition-colors inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground text-left">Edit: {product.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Left Column: The Form */}
        <div>
          <EditProductForm product={product} collections={collections} />
        </div>

        {/* Right Column: Existing Image Gallery (Read-Only Preview for now) */}
        <div>
          <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm text-left">
            <h3 className="text-lg font-medium text-foreground mb-4">Current Gallery</h3>
            {product.images.length === 0 ? (
              <p className="text-sm text-gray-500 text-left">No images uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((img) => (
                  <div key={img.id} className="relative border border-gray-200">
                    <img src={img.image_url} alt={img.alt_text || 'product'} className="w-full h-auto object-cover" />
                    {img.is_primary && (
                      <span className="absolute top-2 left-2 bg-foreground text-background text-[10px] uppercase font-bold px-2 py-1">Primary</span>
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