import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // Keep the local Node pool small.
    // Supabase's transaction pooler handles database-side pooling.
    max: 5,

    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
}

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg(globalForPrisma.pool)

  globalForPrisma.prisma = new PrismaClient({
    adapter,
  })
}

export const prisma = globalForPrisma.prisma