import { todoRepository } from '../repositories/todo.repository.js'
import type { CreateTodoInput, UpdateTodoInput } from '../schemas/todo.schema.js'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export const todoService = {
  async getByDate(date: string) {
    const todos = await todoRepository.findByDate(date)
    return { date, todos }
  },

  async create(input: CreateTodoInput) {
    const maxOrder = await todoRepository.getMaxOrder(input.date)
    return todoRepository.create({ ...input, order: maxOrder + 1 })
  },

  async update(id: string, input: UpdateTodoInput) {
    const existing = await todoRepository.findById(id)
    if (!existing) throw new NotFoundError(`Todo ${id} not found`)
    return todoRepository.update(id, input)
  },

  async delete(id: string) {
    const existing = await todoRepository.findById(id)
    if (!existing) throw new NotFoundError(`Todo ${id} not found`)
    await todoRepository.delete(id)
    return { id }
  },

  async getDatesByMonth(month: string) {
    const dates = await todoRepository.findDistinctDatesByMonth(month)
    return { month, dates }
  },
}
