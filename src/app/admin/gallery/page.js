import { prisma } from '@/lib/prisma'
import GalleryClient from './components/GalleryClient'

export default async function GalleryPage() {
  // Fetch images. If you add a drag-and-drop sort later, this order ensures it stays intact.
  const images = await prisma.gallery.findMany({
    orderBy: [
      { sort_order: 'asc' },
      { id: 'desc' }
    ]
  })

  return <GalleryClient initialImages={images} />
}