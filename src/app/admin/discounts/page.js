import { prisma } from '@/lib/prisma'
import DiscountClient from './components/DiscountClient'

export default async function DiscountsPage() {
  // Fetch all discounts, newest first
  const discounts = await prisma.discountCode.findMany({
    orderBy: { code_string: 'asc' }
  })

  // Fetch collections so the admin can restrict a discount to a specific product line
  const collections = await prisma.collection.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  })

  return <DiscountClient discounts={discounts} collections={collections} />
}