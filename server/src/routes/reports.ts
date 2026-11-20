import { Router } from 'express'
import reports from '../../../mock/reports.json'
import users from '../../../mock/users.json'

const router = Router()

router.get('/', (req, res) => {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 100)
  const { search, q, type, category, location, status, incidentDate } = req.query

  let filtered = reports
  const term = ((search || q) as string | undefined)?.toLowerCase()
  if (term) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(term) || r.description.toLowerCase().includes(term)
    )
  }
  if (type === 'LOST' || type === 'FOUND') {
    filtered = filtered.filter(r => r.type === type)
  }
  if (category) {
    filtered = filtered.filter(r => r.category === category)
  }
  if (location) {
    filtered = filtered.filter(r => r.location.toLowerCase().includes((location as string).toLowerCase()))
  }
  if (status === 'ACTIVE' || status === 'RESOLVED') {
    filtered = filtered.filter(r => r.status === status)
  }
  if (incidentDate) {
    filtered = filtered.filter(r => r.incidentDate === incidentDate)
  }

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const total = sorted.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit)
  const start = (page - 1) * limit

  res.json({
    data: sorted.slice(start, start + limit),
    meta: { page, limit, total, totalPages }
  })
})

router.get('/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id)
  if (!report) {
    return res.status(404).json({ error: { code: 'REPORT_NOT_FOUND', message: 'Report not found' } })
  }
  res.json({ data: report })
})

router.post('/', (req, res) => {
  const { title, description, type, category, location, incidentDate, reporterId, contactMethod } = req.body

  const errors: { field: string; message: string }[] = []
  if (!title) errors.push({ field: 'title', message: 'title is required' })
  if (!description) errors.push({ field: 'description', message: 'description is required' })
  if (!['LOST', 'FOUND'].includes(type)) errors.push({ field: 'type', message: 'type must be LOST or FOUND' })
  if (!category) errors.push({ field: 'category', message: 'category is required' })
  if (!location) errors.push({ field: 'location', message: 'location is required' })
  if (!incidentDate) errors.push({ field: 'incidentDate', message: 'incidentDate is required' })
  if (!reporterId) errors.push({ field: 'reporterId', message: 'reporterId is required' })
  if (!['EMAIL', 'WHATSAPP'].includes(contactMethod)) errors.push({ field: 'contactMethod', message: 'contactMethod must be EMAIL or WHATSAPP' })

  if (errors.length > 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid report data', details: errors } })
  }

  if (!users.some(u => u.id === reporterId)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid report data', details: [{ field: 'reporterId', message: 'reporterId does not exist' }] } })
  }

  const newReport = {
    id: `report-${String(reports.length + 1).padStart(3, '0')}`,
    title,
    description,
    type,
    category,
    location,
    incidentDate,
    imageUrl: null,
    reporterId,
    contactMethod,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }

  reports.push(newReport)
  res.status(201).json({ data: newReport })
})

export default router
