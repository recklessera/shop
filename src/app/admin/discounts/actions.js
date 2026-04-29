'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createDiscountCode(formData) {
  // Force uppercase and remove accidental spaces
  const code_string = formData.get('code_string').toUpperCase().replace(/\s+/g, '')
  const discount_type = formData.get('discount_type')
  const discount_value = parseFloat(formData.get('discount_value'))
  
  const valid_until_raw = formData.get('valid_until')
  const valid_until = valid_until_raw ? new Date(valid_until_raw) : null
  
  const usage_limit_raw = formData.get('usage_limit')
  const usage_limit = usage_limit_raw ? parseInt(usage_limit_raw, 10) : null
  
  const min_order_value_raw = formData.get('min_order_value')
  const min_order_value = min_order_value_raw ? parseFloat(min_order_value_raw) : null
  
  const applicable_collection_id = formData.get('applicable_collection_id') || null

  try {
    await prisma.discountCode.create({
      data: {
        code_string,
        discount_type,
        discount_value,
        valid_until,
        usage_limit,
        min_order_value,
        applicable_collection_id,
        is_active: true,
      }
    })
    revalidatePath('/admin/discounts')
  } catch (error) {
    console.error("Discount creation failed:", error)
    throw new Error('Failed to create code. Make sure this code name is unique.')
  }
}

export async function toggleDiscountStatus(formData) {
  const id = formData.get('id')
  const currentStatus = formData.get('is_active') === 'true'
  
  await prisma.discountCode.update({
    where: { id },
    data: { is_active: !currentStatus }
  })
  revalidatePath('/admin/discounts')
}

export async function deleteDiscountCode(formData) {
  const id = formData.get('id')
  await prisma.discountCode.delete({ where: { id } })
  revalidatePath('/admin/discounts')
}