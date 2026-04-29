import { prisma } from '@/lib/prisma'
import DashboardClient from './components/DashboardClient'

export default async function AdminDashboard() {
  const productsCount = await prisma.product.count({ where: { is_published: true } })
  const ordersCount = await prisma.order.count()
  
  const revenueAggregation = await prisma.order.aggregate({
    _sum: { total_amount: true },
    where: { status: { not: 'cancelled' } }
  })
  const revenue = revenueAggregation._sum.total_amount || 0

  const lowStock = await prisma.product.findMany({
    where: { stock_count: { lte: 5 } },
    select: { id: true, title: true, stock_count: true, sku: true },
    orderBy: { stock_count: 'asc' },
    take: 5
  })

  const recentOrders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      customer: { select: { name: true, email: true } }
    },
    take: 5
  })

  // THE UPGRADE: Fetch Best Sellers
  // 1. Group the OrderItems by product_id and sum up the quantities
  const bestSellersGroup = await prisma.orderItem.groupBy({
    by: ['product_id'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 4 // Get the top 4 selling items
  })

  // 2. Fetch the actual product details for those top sellers
  const bestSellerIds = bestSellersGroup.map(item => item.product_id)
  const bestSellersProducts = await prisma.product.findMany({
    where: { id: { in: bestSellerIds } },
    select: {
      id: true,
      title: true,
      price: true,
      images: { where: { is_primary: true }, take: 1 }
    }
  })

  // 3. Merge the total quantities back with the product details
  const bestSellers = bestSellersGroup.map(group => {
    const product = bestSellersProducts.find(p => p.id === group.product_id)
    return {
      ...product,
      total_sold: group._sum.quantity
    }
  }).filter(item => item.title) // Ensure the product hasn't been deleted

  const initialMetrics = { revenue, ordersCount, productsCount }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <DashboardClient 
        initialMetrics={initialMetrics} 
        lowStock={lowStock} 
        recentOrders={recentOrders} 
        bestSellers={bestSellers}
      />
    </div>
  )
}