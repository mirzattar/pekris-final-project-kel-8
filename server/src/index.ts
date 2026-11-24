import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import reportRoutes from './routes/reports'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const corsOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()).filter(Boolean)

app.use(cors({ origin: corsOrigins?.length ? corsOrigins : '*' }))
app.use(express.json())

app.use('/reports', reportRoutes)

app.get('/', (_req, res) => {
  res.json({ message: 'Lost & Found API' })
})

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as { type?: string; status?: number; statusCode?: number }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body is not valid JSON' } })
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } })
  }
  const status = error.status ?? error.statusCode
  if (status === 400 || status === 413 || status === 415) {
    return res.status(status).json({ error: { code: 'INVALID_REQUEST', message: 'Request could not be processed' } })
  }
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
