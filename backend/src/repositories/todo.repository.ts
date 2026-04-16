import { prisma } from '../lib/prisma.js'
import type { CreateTodoInput, UpdateTodoInput } from '../schemas/todo.schema.js'

export const todoRepository = {
  findByDate(date: string) {
    return prisma.todo.findMany({
      where: { date },
      orderBy: { order: 'asc' },
    })
  },

  findById(id: string) {
    return prisma.todo.findUnique({ where: { id } })
  },

  async getMaxOrder(date: string): Promise<number> {
    const result = await prisma.todo.aggregate({
      where: { date },
      _max: { order: true },
    })
    return result._max.order ?? 0
  },

  create(data: CreateTodoInput & { order: number }) {
    return prisma.todo.create({ data })
  },

  update(id: string, data: UpdateTodoInput) {
    return prisma.todo.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.todo.delete({ where: { id } })
  },
}
