import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const createTodoSchema = z.object({
  date: z.string().regex(dateRegex, 'date must be YYYY-MM-DD format'),
  title: z
    .string()
    .trim()
    .min(1, 'title must not be empty')
    .max(100, 'title must be 100 characters or less'),
})

export const getTodosQuerySchema = z.object({
  date: z.string().regex(dateRegex, 'date must be YYYY-MM-DD format'),
})

export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'title must not be empty')
      .max(100, 'title must be 100 characters or less')
      .optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: 'At least one of title or completed must be provided',
  })

export const getDatesByMonthSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'month must be YYYY-MM format'),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type GetTodosQuery = z.infer<typeof getTodosQuerySchema>
export type GetDatesByMonthQuery = z.infer<typeof getDatesByMonthSchema>
