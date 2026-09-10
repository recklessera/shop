'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData) {
  const id = formData.get('id')
  const status = formData.get('status').toLowerCase()
  
  // Grab the new fields (they will be null if left empty)
  const courier_name = formData.get('courier_name')
  const tracking_number = formData.get('tracking_number')
  const shipping_notes = formData.get('shipping_notes')

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        courier_name,
        tracking_number,
        shipping_notes
      }, 
    })
    
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/admin')
    revalidatePath('/account')

    // If status is shipped, we will call the email function here later!

  } catch (error) {
    console.error("Failed to update order:", error)
    throw new Error('Failed to update order status.')
  }
}