import type { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { fail } from '../lib/response.js'

type Target = 'body' | 'query'

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      const message = (result.error as ZodError).errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      fail(res, 'VALIDATION_ERROR', message, 400)
      return
    }
    req[target] = result.data
    next()
  }
}
