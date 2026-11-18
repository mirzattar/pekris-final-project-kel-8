import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import reportRoutes from './routes/reports'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/reports', reportRoutes)

app.get('/', (_req, res) => {
  res.json({ message: 'Lost & Found API' })
})

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
