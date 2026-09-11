'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addGalleryImage(formData) {
  const imageUrl = formData.get('imageUrl')
  const caption = formData.get('caption') || null
  const category = formData.get('category')?.toLowerCase().trim() || null

  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('No valid image URL provided.')
  }

  try {
    await prisma.gallery.create({
      data: {
        image_url: imageUrl,
        caption,
        category,
      },
    })

    revalidatePath('/admin/gallery')
  } catch (error) {
    console.error('Gallery save failed:', error)
    throw new Error('Failed to save image to the gallery.')
  }
}

export async function deleteGalleryImage(formData) {
  const id = formData.get('id')

  if (!id || typeof id !== 'string') {
    throw new Error('Invalid gallery image ID.')
  }

  try {
    await prisma.gallery.delete({
      where: { id },
    })

    revalidatePath('/admin/gallery')
  } catch (error) {
    console.error('Failed to delete image:', error)
    throw new Error('Failed to delete image.')
  }
}