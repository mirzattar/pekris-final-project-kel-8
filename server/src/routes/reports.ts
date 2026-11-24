import { Router } from 'express'
import reports from '../../../mock/reports.json'
import users from '../../../mock/users.json'

const router = Router()
const categories = ['BOTTLE', 'STATIONERY', 'ACCESSORIES', 'ELECTRONICS', 'DOCUMENTS', 'CLOTHING', 'OTHERS']
const isString = (value: unknown): value is string => typeof value === 'string'
const isDate = (value: unknown): value is string =>
  isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value)

router.get('/', (req, res) => {
  const errors: { field: string; message: string }[] = []
  const { search, q, type, category, location, status, incidentDate } = req.query

  const singleString = (field: string, value: unknown) => {
    if (value === undefined || value === '') return undefined
    if (Array.isArray(value) || !isString(value)) {
      errors.push({ field, message: `${field} must be a single string value` })
      return undefined
    }
    return value
  }

  let page = 1
  if (req.query.page !== undefined) {
    const raw = req.query.page
    if (!isString(raw) || !/^\d+$/.test(raw) || Number(raw) < 1) {
      errors.push({ field: 'page', message: 'page must be an integer greater than or equal to 1' })
    } else {
      page = Number(raw)
    }
  }

  let limit = 10
  if (req.query.limit !== undefined) {
    const raw = req.query.limit
    if (!isString(raw) || !/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 100) {
      errors.push({ field: 'limit', message: 'limit must be an integer between 1 and 100' })
    } else {
      limit = Number(raw)
    }
  }

  const term = singleString('search', search ?? q)?.toLowerCase()
  const typeFilter = singleString('type', type)
  if (typeFilter && typeFilter !== 'LOST' && typeFilter !== 'FOUND') {
    errors.push({ field: 'type', message: 'type must be LOST or FOUND' })
  }
  const categoryFilter = singleString('category', category)
  if (categoryFilter && !categories.includes(categoryFilter)) {
    errors.push({ field: 'category', message: 'category is invalid' })
  }
  const locationFilter = singleString('location', location)
  const statusFilter = singleString('status', status)
  if (statusFilter && statusFilter !== 'ACTIVE' && statusFilter !== 'RESOLVED') {
    errors.push({ field: 'status', message: 'status must be ACTIVE or RESOLVED' })
  }
  const dateFilter = singleString('incidentDate', incidentDate)
  if (dateFilter && !isDate(dateFilter)) {
    errors.push({ field: 'incidentDate', message: 'incidentDate must be a valid YYYY-MM-DD date' })
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: { code: 'INVALID_QUERY', message: 'Invalid query parameters', details: errors } })
  }

  let filtered = reports
  if (term) {
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(term) || r.description.toLowerCase().includes(term)
    )
  }
  if (typeFilter) {
    filtered = filtered.filter(r => r.type === typeFilter)
  }
  if (categoryFilter) {
    filtered = filtered.filter(r => r.category === categoryFilter)
  }
  if (locationFilter) {
    filtered = filtered.filter(r => r.location.toLowerCase().includes(locationFilter.toLowerCase()))
  }
  if (statusFilter) {
    filtered = filtered.filter(r => r.status === statusFilter)
  }
  if (dateFilter) {
    filtered = filtered.filter(r => r.incidentDate === dateFilter)
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
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Request body must be a JSON object' } })
  }
  const { title, description, type, category, location, incidentDate, reporterId, contactMethod } = req.body

  const errors: { field: string; message: string }[] = []
  const requiredText = (field: string, value: unknown) => {
    if (!isString(value) || !value.trim()) errors.push({ field, message: `${field} must be a non-empty string` })
  }
  requiredText('title', title)
  requiredText('description', description)
  requiredText('location', location)
  requiredText('reporterId', reporterId)
  if (type !== 'LOST' && type !== 'FOUND') errors.push({ field: 'type', message: 'type must be LOST or FOUND' })
  if (!isString(category) || !categories.includes(category)) errors.push({ field: 'category', message: 'category is invalid' })
  if (!isDate(incidentDate)) errors.push({ field: 'incidentDate', message: 'incidentDate must be a valid YYYY-MM-DD date' })
  if (contactMethod !== 'EMAIL' && contactMethod !== 'WHATSAPP') errors.push({ field: 'contactMethod', message: 'contactMethod must be EMAIL or WHATSAPP' })

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
