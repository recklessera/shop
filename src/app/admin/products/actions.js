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
  const price = parseFloat(formData.get('price')) 
  const collection_id = formData.get('collection_id')
  const is_published = formData.get('is_published') === 'on' 
  
  const variantsString = formData.get('variants')
  let parsedVariants = []
  if (variantsString) {
    parsedVariants = JSON.parse(variantsString)
  }

  // NEW: Added the price field parsing here
  const variantsData = parsedVariants.map(v => ({
    sku: v.sku,
    size: v.size || null,
    color: v.color || null,
    stock_count: parseInt(v.stock_count, 10) || 0,
    price: (v.price && v.price !== '') ? parseFloat(v.price) : null
  }))

  const imageFiles = formData.getAll('images')
  const primaryIndex = parseInt(formData.get('primaryIndex'), 10) || 0
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  try {
    const uploadPromises = imageFiles.map(file => uploadToCloudinary(file))
    const imageUrls = await Promise.all(uploadPromises)
    const validImages = imageUrls.filter(url => url !== null)

    const productData = {
      title,
      slug,
      description,
      price,
      collection_id,
      is_published,
      variants: {
        create: variantsData
      }
    }

    if (validImages.length > 0) {
      productData.images = {
        create: validImages.map((url, index) => ({
          image_url: url,
          alt_text: title,
          is_primary: index === primaryIndex
        }))
      }
    }

    await prisma.product.create({ data: productData })
    revalidatePath('/admin/products')
  } catch (error) {
    console.error("RAW ERROR:", error)
    throw new Error(`Product Creation Failed: ${error.message || JSON.stringify(error)}`)
  }
}

export async function deleteProduct(formData) {
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
  const price = parseFloat(formData.get('price')) 
  const collection_id = formData.get('collection_id')
  const is_published = formData.get('is_published') === 'on' 

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  try {
    await prisma.product.update({
      where: { id },
      data: { title, slug, description, price, collection_id, is_published },
    })
    
    const variantsString = formData.get('variants')
    if (variantsString) {
      const parsedVariants = JSON.parse(variantsString)
      
      for (const v of parsedVariants) {
        // NEW: Added the price field parsing to the updates
        const variantData = {
          sku: v.sku,
          size: v.size || null,
          color: v.color || null,
          stock_count: parseInt(v.stock_count, 10) || 0,
          price: (v.price && v.price !== '') ? parseFloat(v.price) : null
        }

        if (typeof v.id === 'string') {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: variantData
          })
        } else {
          await prisma.productVariant.create({
            data: {
              ...variantData,
              product_id: id,
            }
          })
        }
      }
    }
    
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
  } catch (error) {
    console.error("RAW ERROR:", error)
    throw new Error(`Product Update Failed: ${error.message || JSON.stringify(error)}`)
  }
}