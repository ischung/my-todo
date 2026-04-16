import { afterEach } from 'vitest'
import { prisma } from '../lib/prisma.js'

// 각 테스트 후 DB 초기화 — 테스트 간 격리 보장
afterEach(async () => {
  await prisma.todo.deleteMany()
})
