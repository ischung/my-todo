import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.routes.js'
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js'

const app = express()

// CORS
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_ORIGIN ?? '']
    : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

// Routes
app.use('/api/v1', healthRouter)

// Error handling (반드시 라우터 이후에 등록)
app.use(notFoundHandler)
app.use(errorHandler)

const PORT = Number(process.env.PORT ?? 3000)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
