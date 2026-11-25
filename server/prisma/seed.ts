import {
  PrismaClient,
  type Category,
  type ContactMethod,
  type ReportStatus,
  type ReportType
} from '@prisma/client'
import reports from '../../mock/reports.json'
import users from '../../mock/users.json'

const prisma = new PrismaClient()

async function main() {
  for (const user of users) {
    const data = {
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      preferredContact: user.preferredContact as ContactMethod
    }
    await prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: { id: user.id, ...data }
    })
  }

  for (const report of reports) {
    const data = {
      title: report.title,
      description: report.description,
      type: report.type as ReportType,
      category: report.category as Category,
      location: report.location,
      incidentDate: new Date(`${report.incidentDate}T00:00:00Z`),
      imageUrl: report.imageUrl,
      reporterId: report.reporterId,
      contactMethod: report.contactMethod as ContactMethod,
      status: report.status as ReportStatus,
      createdAt: new Date(report.createdAt)
    }
    await prisma.report.upsert({
      where: { id: report.id },
      update: data,
      create: { id: report.id, ...data }
    })
  }

  const [userCount, reportCount] = await Promise.all([prisma.user.count(), prisma.report.count()])
  console.log(`Seeded ${userCount} users and ${reportCount} reports`)
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
