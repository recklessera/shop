'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData) {
  const id = formData.get('id')
  const status = formData.get('status')

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    })
    
    // Refresh both the main list and the dashboard
    revalidatePath('/admin/orders')
    revalidatePath('/admin')
  } catch (error) {
    console.error("Failed to update order:", error)
    throw new Error('Failed to update order status.')
  }
}