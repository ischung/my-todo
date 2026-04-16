import { Router } from 'express'
import { todoService, NotFoundError } from '../services/todo.service.js'
import { validate } from '../middlewares/validate.js'
import { createTodoSchema, getTodosQuerySchema, updateTodoSchema } from '../schemas/todo.schema.js'
import { success, fail } from '../lib/response.js'

const router = Router()

// GET /api/v1/todos?date=YYYY-MM-DD
router.get('/', validate(getTodosQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { date } = req.query as { date: string }
    const result = await todoService.getByDate(date)
    success(res, result)
  } catch (err) {
    next(err)
  }
})

// POST /api/v1/todos
router.post('/', validate(createTodoSchema), async (req, res, next) => {
  try {
    const todo = await todoService.create(req.body)
    success(res, todo, 201)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/v1/todos/:id
router.patch('/:id', validate(updateTodoSchema), async (req, res, next) => {
  try {
    const todo = await todoService.update(String(req.params['id']), req.body)
    success(res, todo)
  } catch (err) {
    if (err instanceof NotFoundError) {
      fail(res, 'NOT_FOUND', err.message, 404)
      return
    }
    next(err)
  }
})

// DELETE /api/v1/todos/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await todoService.delete(req.params.id)
    success(res, result)
  } catch (err) {
    if (err instanceof NotFoundError) {
      fail(res, 'NOT_FOUND', err.message, 404)
      return
    }
    next(err)
  }
})

export default router
