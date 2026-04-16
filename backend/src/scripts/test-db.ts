import { prisma } from '../lib/prisma.js'

async function main() {
  const count = await prisma.todo.count()
  console.log('✅ Todo 테이블 레코드 수:', count)

  const todo = await prisma.todo.create({
    data: { date: '2026-04-16', title: '테스트 항목', order: 1 },
  })
  console.log('✅ 생성된 Todo:', todo.id, todo.title)

  await prisma.todo.delete({ where: { id: todo.id } })
  console.log('✅ 삭제 완료')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
