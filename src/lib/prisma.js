import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

// Ensure we don't open a new pool on every hot reload
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  })
}

const adapter = new PrismaPg(globalForPrisma.pool)

// Initialize the client strictly with the adapter per v7 requirements
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}