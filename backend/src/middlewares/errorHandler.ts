import type { Request, Response, NextFunction } from 'express'
import { fail } from '../lib/response.js'

export function notFoundHandler(req: Request, res: Response): void {
  fail(res, 'NOT_FOUND', `Cannot ${req.method} ${req.path}`, 404)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err)
  fail(res, 'INTERNAL_ERROR', 'An unexpected error occurred', 500)
}
