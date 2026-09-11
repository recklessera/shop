import { prisma } from '@/lib/prisma'
import DashboardClient from './components/DashboardClient'

// 1. CRITICAL: Prevent Next.js from caching the dashboard so revenue is always live
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const productsCount = await prisma.product.count({ where: { is_published: true } })
  const ordersCount = await prisma.order.count()
  
  // 2. FIXED: Exclude both cancelled AND pending orders from total revenue
  const revenueAggregation = await prisma.order.aggregate({
    _sum: { total_amount: true },
    where: { 
      status: { notIn: ['cancelled', 'pending'] } 
    }
  })
  const revenue = revenueAggregation._sum.total_amount || 0

  const lowStock = await prisma.productVariant.findMany({
    where: { stock_count: { lte: 5 } },
    include: {
      product: { 
        select: { title: true } 
      }
    },
    orderBy: { stock_count: 'asc' },
    take: 5, 
  })

  const recentOrders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      customer: { select: { name: true, email: true } }
    },
    take: 5
  })

  // 3. FIXED: Only count best sellers from actual, successful orders
  const bestSellersGroup = await prisma.orderItem.groupBy({
    by: ['product_id'],
    _sum: { quantity: true },
    where: {
      order: {
        status: { notIn: ['cancelled', 'pending'] }
      }
    },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 4 
  })

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

  const bestSellers = bestSellersGroup.map(group => {
    const product = bestSellersProducts.find(p => p.id === group.product_id)
    return {
      ...product,
      total_sold: group._sum.quantity
    }
  }).filter(item => item.title) 

  const initialMetrics = { revenue, ordersCount, productsCount }

  // ---------------------------------------------------------
  // GENERATE DAILY DATA (LAST 7 DAYS)
  // ---------------------------------------------------------
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  // 4. FIXED: Exclude pending from charts
  const orders7d = await prisma.order.findMany({
    where: { 
      created_at: { gte: last7Days[0] }, 
      status: { notIn: ['cancelled', 'pending'] } 
    },
    select: { created_at: true, total_amount: true }
  })

  const chartData7d = last7Days.map(day => {
    const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' })
    const dayOrders = orders7d.filter(o => new Date(o.created_at).toDateString() === day.toDateString())
    return {
      date: dayStr,
      revenue: dayOrders.reduce((sum, o) => sum + o.total_amount, 0),
      orders: dayOrders.length
    }
  })

  // ---------------------------------------------------------
  // GENERATE MONTHLY DATA (LAST 6 MONTHS)
  // ---------------------------------------------------------
  const last6Months = Array.from({length: 6}, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    d.setDate(1) 
    d.setHours(0, 0, 0, 0)
    return { 
      start: d, 
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59) 
    }
  })

  // 5. FIXED: Exclude pending from charts
  const orders6m = await prisma.order.findMany({
    where: { 
      created_at: { gte: last6Months[0].start }, 
      status: { notIn: ['cancelled', 'pending'] } 
    },
    select: { created_at: true, total_amount: true }
  })

  const chartData6m = last6Months.map(monthData => {
    const monthStr = monthData.start.toLocaleDateString('en-US', { month: 'short' }) 
    const monthOrders = orders6m.filter(o => {
      const orderDate = new Date(o.created_at)
      return orderDate >= monthData.start && orderDate <= monthData.end
    })
    return {
      date: monthStr,
      revenue: monthOrders.reduce((sum, o) => sum + o.total_amount, 0),
      orders: monthOrders.length
    }
  })

  return (
    <div className="max-w-7xl mx-auto w-full">
      <DashboardClient 
        initialMetrics={initialMetrics} 
        lowStock={lowStock} 
        recentOrders={recentOrders} 
        bestSellers={bestSellers}
        chartData7d={chartData7d} 
        chartData6m={chartData6m}
      />
    </div>
  )
}