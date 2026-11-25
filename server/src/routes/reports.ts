import { Router } from 'express'
import { PrismaClient, type Category, type ContactMethod, type ReportType, type ReportStatus, type User } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()
const categories = ['BOTTLE', 'STATIONERY', 'ACCESSORIES', 'ELECTRONICS', 'DOCUMENTS', 'CLOTHING', 'OTHERS']
const reportFields = ['title', 'description', 'type', 'category', 'location', 'incidentDate', 'reporterId', 'contactMethod']
const maxLengths = { title: 120, description: 2000, location: 120 } as const
const isString = (value: unknown): value is string => typeof value === 'string'
const isDate = (value: unknown): value is string =>
  isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value)

// incidentDate is a DATE column, so it is serialized as YYYY-MM-DD, not a full timestamp.
const toReportJson = (report: {
  id: string
  title: string
  description: string
  type: string
  category: string
  location: string
  incidentDate: Date
  imageUrl: string | null
  reporterId: string
  contactMethod: string
  status: string
  createdAt: Date
}) => ({
  id: report.id,
  title: report.title,
  description: report.description,
  type: report.type,
  category: report.category,
  location: report.location,
  incidentDate: report.incidentDate.toISOString().slice(0, 10),
  imageUrl: report.imageUrl,
  reporterId: report.reporterId,
  contactMethod: report.contactMethod,
  status: report.status,
  createdAt: report.createdAt.toISOString()
})

// Only the contact method chosen on the report is exposed, never both.
const publicReporter = (user: User | null | undefined, contactMethod: string) => {
  if (!user) return null
  const value = contactMethod === 'WHATSAPP' ? user.whatsapp : user.email
  return { name: user.name, contact: { method: contactMethod, value: value ?? null } }
}

router.get('/', async (req, res) => {
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

  const term = singleString('search', search ?? q)
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

  const where: Record<string, unknown> = {}
  if (term) {
    where.OR = [
      { title: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } }
    ]
  }
  if (typeFilter) where.type = typeFilter as ReportType
  if (categoryFilter) where.category = categoryFilter as Category
  if (locationFilter) where.location = { contains: locationFilter, mode: 'insensitive' }
  if (statusFilter) where.status = statusFilter as ReportStatus
  if (dateFilter) where.incidentDate = new Date(`${dateFilter}T00:00:00Z`)

  const [total, rows] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * limit,
      take: limit
    })
  ])

  res.json({
    data: rows.map(toReportJson),
    meta: { page, limit, total, totalPages: total === 0 ? 0 : Math.ceil(total / limit) }
  })
})

router.get('/:id', async (req, res) => {
  const report = await prisma.report.findUnique({
    where: { id: req.params.id },
    include: { reporter: true }
  })
  if (!report) {
    return res.status(404).json({ error: { code: 'REPORT_NOT_FOUND', message: 'Report not found' } })
  }
  res.json({
    data: { ...toReportJson(report), reporter: publicReporter(report.reporter, report.contactMethod) }
  })
})

router.post('/', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Request body must be a JSON object' } })
  }
  const { title, description, type, category, location, incidentDate, reporterId, contactMethod } = req.body

  const errors: { field: string; message: string }[] = []
  const unknownFields = Object.keys(req.body).filter(field => !reportFields.includes(field))
  for (const field of unknownFields) {
    errors.push({ field, message: `${field} is not an allowed field` })
  }

  const requiredText = (field: keyof typeof maxLengths, value: unknown) => {
    if (!isString(value) || !value.trim()) {
      errors.push({ field, message: `${field} must be a non-empty string` })
    } else if (value.trim().length > maxLengths[field]) {
      errors.push({ field, message: `${field} must be at most ${maxLengths[field]} characters` })
    }
  }
  requiredText('title', title)
  requiredText('description', description)
  requiredText('location', location)
  if (!isString(reporterId) || !reporterId.trim()) errors.push({ field: 'reporterId', message: 'reporterId must be a non-empty string' })
  if (type !== 'LOST' && type !== 'FOUND') errors.push({ field: 'type', message: 'type must be LOST or FOUND' })
  if (!isString(category) || !categories.includes(category)) errors.push({ field: 'category', message: 'category is invalid' })
  if (!isDate(incidentDate)) {
    errors.push({ field: 'incidentDate', message: 'incidentDate must be a valid YYYY-MM-DD date' })
  } else if (incidentDate > new Date().toISOString().slice(0, 10)) {
    errors.push({ field: 'incidentDate', message: 'incidentDate must not be in the future' })
  }
  if (contactMethod !== 'EMAIL' && contactMethod !== 'WHATSAPP') errors.push({ field: 'contactMethod', message: 'contactMethod must be EMAIL or WHATSAPP' })

  if (errors.length > 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid report data', details: errors } })
  }

 

  const newReport = await prisma.report.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      type: type as ReportType,
      category: category as Category,
      location: location.trim(),
      incidentDate: new Date(`${incidentDate}T00:00:00Z`),
      reporterId,
      contactMethod: contactMethod as ContactMethod
    }
  })

  res.status(201).json({ data: toReportJson(newReport) })
})

export default router
