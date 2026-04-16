import { PrismaClient } from '@prisma/client'

// 싱글턴 패턴: 개발 환경에서 hot-reload 시 중복 연결 방지
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
