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
      { folder: 'reckless-era/products' }, 
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    ).end(buffer)
  })
}

export async function createProduct(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const sku = formData.get('sku')
  const price = parseFloat(formData.get('price')) 
  const stock_count = parseInt(formData.get('stock_count'), 10)
  const collection_id = formData.get('collection_id')
  const is_published = formData.get('is_published') === 'on' 
  
  // Extract the array of files and the primary index flag
  const imageFiles = formData.getAll('images')
  const primaryIndex = parseInt(formData.get('primaryIndex'), 10) || 0
  
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  try {
    // Upload all images to Cloudinary concurrently
    const uploadPromises = imageFiles.map(file => uploadToCloudinary(file))
    const imageUrls = await Promise.all(uploadPromises)
    
    // Filter out any failed uploads
    const validImages = imageUrls.filter(url => url !== null)

    const productData = {
      title,
      slug,
      sku,
      description,
      price,
      stock_count,
      collection_id,
      is_published,
    }

    // Map the returned URLs to your ProductImage schema
    if (validImages.length > 0) {
      productData.images = {
        create: validImages.map((url, index) => ({
          image_url: url,
          alt_text: title,
          is_primary: index === primaryIndex // Set true for the selected cover image
        }))
      }
    }

    await prisma.product.create({
      data: productData,
    })
    
    revalidatePath('/admin/products')
  } catch (error) {
    console.error("RAW ERROR:", error)
    throw new Error(`Product Creation Failed: ${error.message || JSON.stringify(error)}`)
  }
}

export async function deleteProduct(formData) {
  // Same as before
  const id = formData.get('id')
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
  } catch (error) {
    throw new Error('Failed to delete product.')
  }
}

export async function updateProduct(formData) {
  const id = formData.get('id')
  const title = formData.get('title')
  const description = formData.get('description')
  const sku = formData.get('sku')
  const price = parseFloat(formData.get('price')) 
  const stock_count = parseInt(formData.get('stock_count'), 10)
  const collection_id = formData.get('collection_id')
  const is_published = formData.get('is_published') === 'on' 

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  try {
    await prisma.product.update({
      where: { id },
      data: {
        title,
        slug,
        sku,
        description,
        price,
        stock_count,
        collection_id,
        is_published,
      },
    })
    
    // Refresh both the main list and this specific product's page
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
  } catch (error) {
    console.error("RAW ERROR:", error)
    throw new Error(`Product Update Failed: ${error.message || JSON.stringify(error)}`)
  }
}