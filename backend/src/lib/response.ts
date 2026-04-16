import type { Response } from 'express'

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { code: string; message: string } }

export function success<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ data, error: null })
}

export function fail(res: Response, code: string, message: string, status: number): void {
  res.status(status).json({ data: null, error: { code, message } })
}
