import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  // 1. Initialize Pool with a strict connection limit for Next.js dev
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      // CRITICAL: Limit connections in development to prevent Supabase exhaustion
      max: process.env.NODE_ENV === 'development' ? 2 : 20 
    })
  }

  // 2. Only create the adapter ONCE
  const adapter = new PrismaPg(globalForPrisma.pool)
  
  // 3. Initialize the client ONCE
  globalForPrisma.prisma = new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma

// 4. This is no longer strictly needed because of the block above, 
// but kept as a standard safety net.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}