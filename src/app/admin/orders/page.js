import { prisma } from '@/lib/prisma'
import OrdersClient from './components/OrdersClient'

export default async function OrdersPage() {
  // Fetch all orders with customer details and item counts
  const orders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      customer: {
        select: { name: true, email: true }
      },
      _count: {
        select: { items: true }
      }
    }
  })

  return <OrdersClient initialOrders={orders} />
}