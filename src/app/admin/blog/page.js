import { prisma } from '@/lib/prisma'
import BlogClient from './components/BlogClient'

export default async function BlogPage() {
  // Fetch blogs and include the linked User (author) data
  const blogs = await prisma.blog.findMany({
    orderBy: [
      { published_at: 'desc' }, // Show newest published first
      { id: 'desc' }            // Fallback for drafts
    ],
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })

  return <BlogClient blogs={blogs} />
}