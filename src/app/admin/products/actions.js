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
 * Delete an image from Cloudinary using its URL.
 */
async function deleteFromCloudinary(imageUrl) {
  if (!imageUrl) return

  try {
    const uploadPart = imageUrl.split('/upload/')[1]

    if (!uploadPart) return

    // Remove Cloudinary version, e.g. v1234567890/
    const pathWithoutVersion = uploadPart.replace(
      /^v\d+\//,
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
 * Create a new product.
 */
export async function createProduct(formData) {
  const title = formData.get('title')?.toString().trim()
  const description = formData.get('description')?.toString().trim()
  const price = parseFloat(formData.get('price'))
  const collection_id = formData.get('collection_id')?.toString()
  const is_published =
    formData.get('is_published') === 'on'

  const variantsString = formData.get('variants')
  const imageUrlsString = formData.get('imageUrls')
  const primaryIndex =
    parseInt(formData.get('primaryIndex'), 10) || 0

  if (!title) {
    throw new Error('Product title is required.')
  }

  if (!description) {
    throw new Error('Product description is required.')
  }

  if (Number.isNaN(price) || price < 0) {
    throw new Error(
      'A valid product price is required.'
    )
  }

  if (!collection_id) {
    throw new Error(
      'Please select a collection.'
    )
  }

  /**
   * Parse variants.
   */
  let parsedVariants = []

  if (variantsString) {
    try {
      parsedVariants = JSON.parse(
        variantsString.toString()
      )
    } catch {
      throw new Error(
        'Invalid product variant data.'
      )
    }
  }

  /**
   * Parse image URLs.
   */
  let imageUrls = []

  if (imageUrlsString) {
    try {
      imageUrls = JSON.parse(
        imageUrlsString.toString()
      )
    } catch {
      throw new Error(
        'Invalid product image data.'
      )
    }
  }

  imageUrls = imageUrls.filter(
    (url) =>
      typeof url === 'string' &&
      url.startsWith('https://')
  )

  /**
   * Prepare variants.
   */
  const variantsData = parsedVariants.map((variant) => {
    const variantPrice =
      variant.price !== undefined &&
      variant.price !== null &&
      variant.price !== ''
        ? parseFloat(variant.price)
        : null

    return {
      sku: variant.sku?.toString().trim(),
      size: variant.size
        ? variant.size.toString().trim()
        : null,
      color: variant.color
        ? variant.color.toString().trim()
        : null,
      stock_count:
        parseInt(variant.stock_count, 10) || 0,
      price:
        variantPrice !== null &&
        !Number.isNaN(variantPrice)
          ? variantPrice
          : null
    }
  })

  /**
   * Validate SKUs.
   */
  const invalidSku = variantsData.find(
    (variant) => !variant.sku
  )

  if (invalidSku) {
    throw new Error(
      'All product variants must have a SKU.'
    )
  }

  /**
   * Prevent duplicate SKUs inside this product.
   */
  const skuSet = new Set()

  for (const variant of variantsData) {
    if (skuSet.has(variant.sku)) {
      throw new Error(
        `Duplicate SKU detected: ${variant.sku}`
      )
    }

    skuSet.add(variant.sku)
  }

  /**
   * Generate slug.
   */
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  try {
    /**
     * Make sure the slug isn't already used.
     */
    const existingSlug =
      await prisma.product.findUnique({
        where: { slug }
      })

    if (existingSlug) {
      throw new Error(
        'A product with this title already exists. Please use a different title.'
      )
    }

    /**
     * Make sure SKUs don't already exist.
     */
    if (variantsData.length > 0) {
      const existingVariants =
        await prisma.productVariant.findMany({
          where: {
            sku: {
              in: variantsData.map(
                (variant) => variant.sku
              )
            }
          },
          select: {
            sku: true
          }
        })

      if (existingVariants.length > 0) {
        throw new Error(
          `SKU already exists: ${existingVariants[0].sku}`
        )
      }
    }

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

    /**
     * Attach uploaded Cloudinary images.
     */
    if (imageUrls.length > 0) {
      const safePrimaryIndex =
        primaryIndex >= 0 &&
        primaryIndex < imageUrls.length
          ? primaryIndex
          : 0

      productData.images = {
        create: imageUrls.map((url, index) => ({
          image_url: url,
          alt_text: title,
          is_primary:
            index === safePrimaryIndex
        }))
      }
    }

    await prisma.product.create({
      data: productData
    })

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')

  } catch (error) {
    console.error(
      'RAW PRODUCT CREATION ERROR:',
      error
    )

    throw new Error(
      `Product Creation Failed: ${
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      }`
    )
  }
}

/**
 * Delete a product.
 *
 * Products linked to existing orders cannot be deleted
 * because doing so would destroy historical order data.
 */
export async function deleteProduct(formData) {
  const id = formData.get('id')?.toString()

  if (!id) {
    throw new Error(
      'Product ID is required.'
    )
  }

  try {
    /**
     * Protect historical orders.
     */
    const orderItemCount =
      await prisma.orderItem.count({
        where: {
          product_id: id
        }
      })

    if (orderItemCount > 0) {
      throw new Error(
        'This product cannot be deleted because it is linked to existing orders. Unpublish it instead to preserve your order history.'
      )
    }

    /**
     * Get product and images before deleting.
     */
    const product =
      await prisma.product.findUnique({
        where: {
          id
        },
        include: {
          images: true
        }
      })

    if (!product) {
      throw new Error(
        'Product not found.'
      )
    }

    /**
     * Delete the database record first.
     *
     * Product variants and images use onDelete: Cascade,
     * so the related database records will be removed too.
     */
    await prisma.product.delete({
      where: {
        id
      }
    })

    /**
     * Remove Cloudinary images after the DB
     * deletion succeeds.
     */
    if (product.images.length > 0) {
      await Promise.all(
        product.images.map((image) =>
          deleteFromCloudinary(
            image.image_url
          )
        )
      )
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')

  } catch (error) {
    console.error(
      'Product deletion error:',
      error
    )

    if (
      error instanceof Error &&
      error.message.includes(
        'linked to existing orders'
      )
    ) {
      throw error
    }

    throw new Error(
      `Failed to delete product: ${
        error instanceof Error
          ? error.message
          : 'Unknown error'
      }`
    )
  }
}

/**
 * Update an existing product.
 *
 * Handles:
 * - Product information
 * - Price
 * - Collection
 * - Publish / Unpublish
 * - Existing variants
 * - New variants
 * - Safe variant ownership checks
 */
export async function updateProduct(formData) {
  const id = formData.get('id')?.toString()
  const title = formData
    .get('title')
    ?.toString()
    .trim()
  const description = formData
    .get('description')
    ?.toString()
    .trim()
  const price = parseFloat(
    formData.get('price')
  )
  const collection_id = formData
    .get('collection_id')
    ?.toString()

  /**
   * IMPORTANT:
   *
   * The EditProductForm sends:
   *
   * is_published = "on"
   *
   * when the product is published.
   *
   * If unchecked, the field doesn't contain "on",
   * so this correctly becomes false.
   */
  const is_published =
    formData.get('is_published') === 'on'

  if (!id) {
    throw new Error(
      'Product ID is required.'
    )
  }

  if (!title) {
    throw new Error(
      'Product title is required.'
    )
  }

  if (!description) {
    throw new Error(
      'Product description is required.'
    )
  }

  if (Number.isNaN(price) || price < 0) {
    throw new Error(
      'A valid product price is required.'
    )
  }

  if (!collection_id) {
    throw new Error(
      'Please select a collection.'
    )
  }

  /**
   * Check that the product exists.
   */
  const existingProduct =
    await prisma.product.findUnique({
      where: {
        id
      },
      include: {
        variants: {
          include: {
            orderItems: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

  if (!existingProduct) {
    throw new Error(
      'Product not found.'
    )
  }

  /**
   * Generate new slug.
   */
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  try {
    /**
     * Check if another product already uses
     * this slug.
     */
    const slugConflict =
      await prisma.product.findFirst({
        where: {
          slug,
          NOT: {
            id
          }
        },
        select: {
          id: true
        }
      })

    if (slugConflict) {
      throw new Error(
        'A product with this title already exists. Please use a different title.'
      )
    }

    /**
     * Update the main product information.
     *
     * This is where Publish / Unpublish is committed
     * to the database.
     */
    await prisma.product.update({
      where: {
        id
      },
      data: {
        title,
        slug,
        description,
        price,
        collection_id,
        is_published
      }
    })

    /**
     * Process variants.
     */
    const variantsString =
      formData.get('variants')

    if (variantsString) {
      let parsedVariants

      try {
        parsedVariants = JSON.parse(
          variantsString.toString()
        )
      } catch {
        throw new Error(
          'Invalid variant data.'
        )
      }

      if (!Array.isArray(parsedVariants)) {
        throw new Error(
          'Invalid variant data.'
        )
      }

      /**
       * Validate SKUs before making changes.
       */
      const skuSet = new Set()

      for (const variant of parsedVariants) {
        const sku =
          variant.sku
            ?.toString()
            .trim()

        if (!sku) {
          throw new Error(
            'All variants must have a SKU.'
          )
        }

        if (skuSet.has(sku)) {
          throw new Error(
            `Duplicate SKU detected: ${sku}`
          )
        }

        skuSet.add(sku)
      }

      /**
       * Get all SKUs currently used by other variants.
       *
       * We exclude variants belonging to this product
       * because those SKUs are allowed to remain unchanged.
       */
      const submittedSkus =
        parsedVariants.map((variant) =>
          variant.sku
            .toString()
            .trim()
        )

      const conflictingSkuVariants =
        await prisma.productVariant.findMany({
          where: {
            sku: {
              in: submittedSkus
            },
            product_id: {
              not: id
            }
          },
          select: {
            sku: true
          }
        })

      if (
        conflictingSkuVariants.length > 0
      ) {
        throw new Error(
          `SKU already exists: ${conflictingSkuVariants[0].sku}`
        )
      }

      /**
       * Track existing variant IDs submitted
       * by the form.
       */
      const submittedExistingVariantIds =
        new Set()

      /**
       * Update existing variants or create
       * new variants.
       */
      for (const variant of parsedVariants) {
        const variantId =
          typeof variant.id === 'string'
            ? variant.id
            : null

        const variantData = {
          sku: variant.sku
            .toString()
            .trim(),

          size: variant.size
            ? variant.size
                .toString()
                .trim()
            : null,

          color: variant.color
            ? variant.color
                .toString()
                .trim()
            : null,

          stock_count:
            parseInt(
              variant.stock_count,
              10
            ) || 0,

          price:
            variant.price !== undefined &&
            variant.price !== null &&
            variant.price !== ''
              ? parseFloat(
                  variant.price
                )
              : null
        }

        /**
         * Existing variant.
         */
        if (variantId) {
          const ownedVariant =
            existingProduct.variants.find(
              (existingVariant) =>
                existingVariant.id ===
                variantId
            )

          /**
           * Never allow the submitted form
           * to update a variant belonging to
           * another product.
           */
          if (!ownedVariant) {
            throw new Error(
              'Invalid product variant.'
            )
          }

          submittedExistingVariantIds.add(
            variantId
          )

          await prisma.productVariant.update({
            where: {
              id: variantId
            },
            data: variantData
          })
        } else {
          /**
           * New variant.
           */
          await prisma.productVariant.create({
            data: {
              ...variantData,
              product_id: id
            }
          })
        }
      }

      /**
       * Handle variants removed from the editor.
       *
       * We can safely delete variants that have
       * never been included in an order.
       *
       * Variants that appear in historical orders
       * are deliberately preserved so that order
       * history remains intact.
       */
      const removedVariants =
        existingProduct.variants.filter(
          (existingVariant) =>
            !submittedExistingVariantIds.has(
              existingVariant.id
            )
        )

      for (const variant of removedVariants) {
        /**
         * Never delete a variant referenced by
         * an existing order.
         */
        if (
          variant.orderItems.length > 0
        ) {
          continue
        }

        await prisma.productVariant.delete({
          where: {
            id: variant.id
          }
        })
      }
    }

    /**
     * Refresh admin and storefront pages.
     */
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath('/shop')
    revalidatePath('/')
    revalidatePath(
      `/products/${existingProduct.slug}`
    )

  } catch (error) {
    console.error(
      'RAW PRODUCT UPDATE ERROR:',
      error
    )

    throw new Error(
      `Product Update Failed: ${
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      }`
    )
  }
}