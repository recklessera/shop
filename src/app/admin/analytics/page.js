import { prisma } from '@/lib/prisma'
import AnalyticsClient from './components/AnalyticsClient'

// 1. CRITICAL FIX: Ensure this page never caches so your data is always real-time
export const dynamic = 'force-dynamic' 

export default async function AnalyticsPage() {

  const activeProductsCount = await prisma.product.count({ where: { is_published: true } })
  
  // 1. PERFORMANCE SUMMARY
  const ordersAggregation = await prisma.order.aggregate({
    _sum: { total_amount: true },
    _count: { id: true },
    where: { status: { not: 'cancelled' } }
  })
  
  const revenue = ordersAggregation._sum.total_amount || 0
  const totalOrders = ordersAggregation._count.id || 0
  const averageOrderValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0

  // Total Items Sold
  const itemsAggregation = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: { order: { status: { not: 'cancelled' } } }
  })
  const totalItemsSold = itemsAggregation._sum.quantity || 0

  // 2. CUSTOMER INSIGHTS
  // Top Spenders
  const topCustomerStats = await prisma.order.groupBy({
    by: ['customer_id'],
    _sum: { total_amount: true },
    _count: { id: true },
    where: { status: { not: 'cancelled' } },
    orderBy: { _sum: { total_amount: 'desc' } },
    take: 5
  })
  
  const topCustomerIds = topCustomerStats.map(c => c.customer_id)
  const topCustomersData = await prisma.user.findMany({
    where: { id: { in: topCustomerIds } },
    select: { id: true, name: true, email: true }
  })
  
  const topCustomers = topCustomerStats.map(stat => {
    // 2. CRITICAL FIX: Fallback in case a user was deleted but their order remained
    const user = topCustomersData.find(c => c.id === stat.customer_id) || { name: 'Deleted User', email: 'N/A' }
    return {
      ...user,
      totalSpent: stat._sum.total_amount || 0,
      ordersCount: stat._count.id
    }
  })

  // Best Sellers
  const bestSellersGroup = await prisma.orderItem.groupBy({
    by: ['product_id'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5
  })
  
  const bestSellerIds = bestSellersGroup.map(item => item.product_id)
  const bestSellersProducts = await prisma.product.findMany({
    where: { id: { in: bestSellerIds } },
    select: { id: true, title: true }
  })
  
  const bestSellers = bestSellersGroup.map(group => {
    const product = bestSellersProducts.find(p => p.id === group.product_id)
    return { ...product, total_sold: group._sum.quantity }
  }).filter(item => item.title)

  // 3. INVENTORY HEALTH
  const inventoryAggregation = await prisma.productVariant.aggregate({
    _count: { id: true }, 
    _sum: { stock_count: true }, 
    where: { 
      product: { is_published: true } 
    }
  })
  
  const totalStockUnits = inventoryAggregation._sum.stock_count || 0

  // Pricing Stats
  const products = await prisma.product.findMany({
    where: { is_published: true },
    select: { price: true },
    orderBy: { price: 'asc' } 
  })
  
  let cheapestItemPrice = 0
  let medianPrice = 0
  
  if (products.length > 0) {
    cheapestItemPrice = products[0].price
    const mid = Math.floor(products.length / 2)
    medianPrice = products.length % 2 !== 0 
      ? products[mid].price 
      : (products[mid - 1].price + products[mid].price) / 2
  }

  // Low Stock Items (< 5) - Targeting Variants now!
  const lowStockItems = await prisma.productVariant.findMany({
    where: { stock_count: { lte: 5 } },
    include: {
      product: { select: { title: true } }
    },
    orderBy: { stock_count: 'asc' },
    take: 20
  })

  // Compile the final payload
  const metrics = {
    revenue,
    totalOrders,
    averageOrderValue,
    totalItemsSold,
    topCustomers,
    bestSellers,
    activeProductsCount,
    totalStockUnits,
    cheapestItemPrice,
    medianPrice,
    lowStockItems
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <AnalyticsClient metrics={metrics} />
    </div>
  )
}