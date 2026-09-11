'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Delete an image from Cloudinary using its secure URL.
 */
async function deleteFromCloudinary(imageUrl) {
  if (!imageUrl) return

  try {
    const uploadPart = imageUrl.split('/upload/')[1]

    if (!uploadPart) return

    // Remove Cloudinary version prefix, e.g. v123456789/
    const pathWithoutVersion = uploadPart.replace(
      /^v\d+\/?/,
      ''
    )

    // Remove file extension
    const publicId = pathWithoutVersion.replace(
      /\.[^/.]+$/,
      ''
    )

    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
    })
  } catch (error) {
    console.error(
      'Failed to delete image from Cloudinary:',
      error
    )
  }
}

/**
 * CREATE PRODUCT
 *
 * IMPORTANT:
 * This action now receives image URLs only.
 *
 * The actual image files are uploaded directly
 * from the browser to Cloudinary.
 */
export async function createProduct(formData) {
  const title = formData.get('title')
  const description = formData.get('description')
  const price = parseFloat(formData.get('price'))
  const collection_id = formData.get('collection_id')
  const is_published =
    formData.get('is_published') === 'on'

  const variantsString =
    formData.get('variants')

  const imageUrlsString =
    formData.get('imageUrls')

  const primaryIndex =
    parseInt(formData.get('primaryIndex'), 10) || 0

  if (!title) {
    throw new Error('Product title is required.')
  }

  if (!description) {
    throw new Error(
      'Product description is required.'
    )
  }

  if (Number.isNaN(price)) {
    throw new Error('A valid product price is required.')
  }

  if (!collection_id) {
    throw new Error('Please select a collection.')
  }

  let parsedVariants = []

  if (variantsString) {
    try {
      parsedVariants = JSON.parse(variantsString)
    } catch {
      throw new Error(
        'Invalid product variant data.'
      )
    }
  }

  let imageUrls = []

  if (imageUrlsString) {
    try {
      imageUrls = JSON.parse(imageUrlsString)
    } catch {
      throw new Error(
        'Invalid product image data.'
      )
    }
  }

  // Only accept actual strings that look like URLs.
  imageUrls = imageUrls.filter(
    url =>
      typeof url === 'string' &&
      url.startsWith('https://')
  )

  const variantsData = parsedVariants.map(v => ({
    sku: v.sku,
    size: v.size || null,
    color: v.color || null,
    stock_count:
      parseInt(v.stock_count, 10) || 0,
    price:
      v.price && v.price !== ''
        ? parseFloat(v.price)
        : null
  }))

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  try {
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

    if (imageUrls.length > 0) {
      productData.images = {
        create: imageUrls.map(
          (url, index) => ({
            image_url: url,
            alt_text: title,
            is_primary:
              index === primaryIndex
          })
        )
      }
    }

    await prisma.product.create({
      data: productData
    })

    revalidatePath('/admin/products')
  } catch (error) {
    console.error(
      'RAW PRODUCT CREATION ERROR:',
      error
    )

    throw new Error(
      `Product Creation Failed: ${
        error.message ||
        JSON.stringify(error)
      }`
    )
  }
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(formData) {
  const id = formData.get('id')

  if (!id) {
    throw new Error('Product ID is required.')
  }

  try {
    const product =
      await prisma.product.findUnique({
        where: { id },
        include: { images: true }
      })

    if (
      product &&
      product.images.length > 0
    ) {
      const deletePromises =
        product.images.map(
          img =>
            deleteFromCloudinary(
              img.image_url
            )
        )

      await Promise.all(deletePromises)
    }

    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/admin/products')
  } catch (error) {
    console.error(
      'Product deletion error:',
      error
    )

    throw new Error(
      'Failed to delete product.'
    )
  }
}

/**
 * UPDATE PRODUCT
 */
export async function updateProduct(formData) {
  const id = formData.get('id')
  const title = formData.get('title')
  const description = formData.get('description')
  const price = parseFloat(formData.get('price'))
  const collection_id =
    formData.get('collection_id')

  const is_published =
    formData.get('is_published') === 'on'

  if (!id) {
    throw new Error('Product ID is required.')
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  try {
    await prisma.product.update({
      where: { id },

      data: {
        title,
        slug,
        description,
        price,
        collection_id,
        is_published
      }
    })

    const variantsString =
      formData.get('variants')

    if (variantsString) {
      let parsedVariants

      try {
        parsedVariants =
          JSON.parse(variantsString)
      } catch {
        throw new Error(
          'Invalid variant data.'
        )
      }

      for (const v of parsedVariants) {
        const variantData = {
          sku: v.sku,
          size: v.size || null,
          color: v.color || null,
          stock_count:
            parseInt(v.stock_count, 10) || 0,
          price:
            v.price && v.price !== ''
              ? parseFloat(v.price)
              : null
        }

        if (
          typeof v.id === 'string' &&
          v.id.length > 0
        ) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: variantData
          })
        } else {
          await prisma.productVariant.create({
            data: {
              ...variantData,
              product_id: id
            }
          })
        }
      }
    }

    revalidatePath('/admin/products')
    revalidatePath(
      `/admin/products/${id}`
    )
  } catch (error) {
    console.error(
      'RAW PRODUCT UPDATE ERROR:',
      error
    )

    throw new Error(
      `Product Update Failed: ${
        error.message ||
        JSON.stringify(error)
      }`
    )
  }
}