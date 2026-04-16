import { Router } from 'express'
import { success } from '../lib/response.js'

const router = Router()

router.get('/health', (_req, res) => {
  success(res, { status: 'ok' })
})

export default router
