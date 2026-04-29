'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary securely using your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function addGalleryImage(formData) {
  const imageFile = formData.get('image')
  const caption = formData.get('caption') || null
  // Standardize categories to lowercase for cleaner filtering
  const category = formData.get('category')?.toLowerCase().trim() || null

  if (!imageFile || imageFile.size === 0) {
    throw new Error('No valid image file provided.')
  }

  try {
    // 1. Convert the Next.js File object into a Base64 string so Cloudinary can read it
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')
    const fileUri = `data:${imageFile.type};base64,${base64Data}`

    // 2. Upload the buffer directly to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'reckless_era/gallery', // Keeps your Cloudinary dashboard organized
    })

    // 3. Save the resulting secure URL to your database
    await prisma.gallery.create({
      data: {
        image_url: uploadResponse.secure_url,
        caption,
        category,
      }
    })

    revalidatePath('/admin/gallery')
  } catch (error) {
    console.error("Gallery upload failed:", error)
    throw new Error('Failed to upload image to the gallery.')
  }
}

export async function deleteGalleryImage(formData) {
  const id = formData.get('id')
  try {
    // NOTE: This deletes the record from your database. 
    // In the future, if you want to save Cloudinary storage space, you can also 
    // add logic here to delete the asset from Cloudinary using its public_id!
    await prisma.gallery.delete({ where: { id } })
    revalidatePath('/admin/gallery')
  } catch (error) {
    console.error("Failed to delete image:", error)
    throw new Error('Failed to delete image.')
  }
}