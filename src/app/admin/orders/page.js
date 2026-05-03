import { prisma } from '@/lib/prisma'
import OrdersClient from './components/OrdersClient'

// Force dynamic rendering so the admin always sees the latest orders
export const dynamic = 'force-dynamic' 

export default async function OrdersPage() {
  // Fetch all orders with customer details (including phone) and item counts
  const orders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      customer: {
        select: { name: true, email: true, phone_number: true }
      },
      _count: {
        select: { items: true }
      }
    }
  })

  return <OrdersClient initialOrders={orders} />
}