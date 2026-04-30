'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadToCloudinary(file) {
  if (!file || typeof file === 'string' || file.size === 0 || file.name === 'undefined') {
    return null
  }
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'reckless-era/collections' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    ).end(buffer)
  })
}

// NEW: You must add this function here too!
async function deleteFromCloudinary(imageUrl) {
  if (!imageUrl) return
  
  try {
    const parts = imageUrl.split('/upload/')
    if (parts.length !== 2) return
    
    const pathWithVersion = parts[1]
    const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '')
    const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.'))

    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error)
  }
}

export async function createCollection(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const coverImageFile = formData.get('coverImage')
  const bannerImageFile = formData.get('bannerImage')
  
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  try {
    const [coverImageUrl, bannerImageUrl] = await Promise.all([
      uploadToCloudinary(coverImageFile),
      uploadToCloudinary(bannerImageFile)
    ])

    await prisma.collection.create({
      data: {
        title,
        slug,
        description: description || null,
        cover_image_url: coverImageUrl || null,   
        banner_image_url: bannerImageUrl || null,  
      },
    })
    revalidatePath('/admin/collections')
  } catch (error) {
    console.error("RAW ERROR:", error)
    // We are now throwing the EXACT error message to the UI so we can see what's wrong
    throw new Error(`Upload Failed: ${error.message || JSON.stringify(error)}`)
  }
}

export async function deleteCollection(formData) {
  const id = formData.get('id')
  try {
    // 1. Fetch the collection to grab the image URLs
    const collection = await prisma.collection.findUnique({ 
      where: { id } 
    })

    // 2. Destroy images on Cloudinary if they exist
    if (collection?.cover_image_url) {
      await deleteFromCloudinary(collection.cover_image_url)
    }
    if (collection?.banner_image_url) {
      await deleteFromCloudinary(collection.banner_image_url)
    }

    // 3. Delete from the database
    await prisma.collection.delete({ where: { id } })
    revalidatePath('/admin/collections')
  } catch (error) {
    throw new Error('Failed to delete collection.')
  }
}

export async function updateCollection(formData) {
  const id = formData.get('id')
  const title = formData.get('title')
  const description = formData.get('description')
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const coverImageFile = formData.get('cover_image')
  const bannerImageFile = formData.get('banner_image')

  try {
    const updateData = {
      title,
      slug,
      description,
    }

    // Only upload and update if a new file was actually selected
    if (coverImageFile && coverImageFile.size > 0) {
      const coverUrl = await uploadToCloudinary(coverImageFile)
      if (coverUrl) updateData.cover_image_url = coverUrl
    }

    if (bannerImageFile && bannerImageFile.size > 0) {
      const bannerUrl = await uploadToCloudinary(bannerImageFile)
      if (bannerUrl) updateData.banner_image_url = bannerUrl
    }

    await prisma.collection.update({
      where: { id },
      data: updateData
    })

    revalidatePath('/admin/collections')
    revalidatePath(`/admin/collections/${id}`)
  } catch (error) {
    console.error("RAW ERROR:", error)
    throw new Error(`Collection Update Failed: ${error.message || JSON.stringify(error)}`)
  }
}