import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'
import EditCollectionForm from '../components/EditCollectionForm'

export default async function EditCollectionPage({ params }) {
  const { id } = await params

  const collection = await prisma.collection.findUnique({
    where: { id }
  })

  if (!collection) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto w-full text-left">
      <div className="mb-6">
        <Link href="/admin/collections" className="text-sm font-bold text-gray-500 hover:text-brand-pink flex items-center gap-2 transition-colors inline-flex px-3 py-2 -ml-3 rounded-lg hover:bg-brand-pink/5">
          <ArrowLeft className="h-4 w-4" /> Back to Collections
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          Edit: {collection.title}
        </h1>
        <p className="text-sm font-medium text-gray-500">Update collection details and marketing imagery.</p>
      </div>

      <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-brand-pink/10 rounded-lg">
            <Layers className="h-5 w-5 text-brand-pink" />
          </div>
          Collection Details
        </h3>
        <EditCollectionForm collection={collection} />
      </div>
    </div>
  )
}