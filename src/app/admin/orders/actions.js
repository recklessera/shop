'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import OrderShippedEmail from '@/components/emails/OrderShippedEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function updateOrderStatus(formData) {
  const id = formData.get('id')
  const status = formData.get('status').toLowerCase()
  
  const courier_name = formData.get('courier_name')
  const tracking_number = formData.get('tracking_number')
  const shipping_notes = formData.get('shipping_notes')

  try {
    // 1. Update the database AND grab the customer data at the same time
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        courier_name,
        tracking_number,
        shipping_notes
      },
      include: { customer: true } // CRITICAL: We need this for the email!
    })
    
    // 2. Trigger the Email IF the status is shipped
    if (status === 'shipped' && updatedOrder.customer?.email) {
      
      // Safely parse the address to get their first name
      let address = {}
      try {
        address = typeof updatedOrder.shipping_address === 'string' 
          ? JSON.parse(updatedOrder.shipping_address) 
          : (updatedOrder.shipping_address || {})
      } catch (e) {
        address = {}
      }

      const { error: emailError } = await resend.emails.send({
        from: `Reckless Era <${process.env.NEXT_PUBLIC_STORE_EMAIL || 'orders@recklessera.com'}>`,
        to: [updatedOrder.customer.email],
        subject: `Your Order Has Shipped: #${updatedOrder.id.slice(0, 8).toUpperCase()}`,
        react: <OrderShippedEmail 
          firstName={address.firstName || updatedOrder.customer.name || 'Customer'}
          orderId={updatedOrder.id}
          courierName={courier_name}
          trackingNumber={tracking_number}
          shippingNotes={shipping_notes}
        />
      })

      if (emailError) {
        console.error('Failed to send shipping email:', emailError)
        // We don't throw an error here because the DB update was successful
      }
    }

    // 3. Refresh all views to show the new status instantly
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/admin')
    revalidatePath('/account')

  } catch (error) {
    console.error("Failed to update order:", error)
    throw new Error('Failed to update order status.')
  }
}