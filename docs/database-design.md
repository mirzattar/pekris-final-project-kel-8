# Database Design

Data structure plan for CP1 (not implemented yet), Prisma is only used in Week 3.
Field reference: `mock/reports.json` and `mock/users.json`.

## Report Table

Fields used:

- `id` — String, primary key
- `title` — String, item name
- `description` — String, item description
- `type` — enum ReportType, values LOST or FOUND
- `category` — enum Category, default OTHERS
- `location` — String, where the item was lost/found
- `incidentDate` — DateTime, incident date
- `imageUrl` — String, optional (null when there is no photo)
- `reporterId` — String, links to User.id
- `contactMethod` — enum ContactMethod
- `status` — enum ReportStatus, default ACTIVE
- `createdAt` — DateTime, set automatically on create

## User Table

- `id` — String, primary key
- `name` — String
- `email` — String, unique
- `preferredContact` — enum ContactMethod


## Relations

User 1 to many Report.

One report has one reporter, one reporter can create many reports. Linked through `reporterId`.

## Enums

ReportType: LOST, FOUND

Category: BOTTLE, STATIONERY, ACCESSORIES, ELECTRONICS, DOCUMENTS, CLOTHING, OTHERS

ContactMethod: EMAIL, WHATSAPP

ReportStatus: ACTIVE, RESOLVED

LOST/FOUND comes from the brief requirement. The rest is copied from the existing mock.

## Prisma schema plan (Week 3)

```prisma
enum ReportType {
  LOST
  FOUND
}

enum Category {
  BOTTLE
  STATIONERY
  ACCESSORIES
  ELECTRONICS
  DOCUMENTS
  CLOTHING
  OTHERS
}

enum ContactMethod {
  EMAIL
  WHATSAPP
}

enum ReportStatus {
  ACTIVE
  RESOLVED
}

model User {
  id               String         @id @default(cuid())
  name             String
  email            String         @unique
  preferredContact ContactMethod
  reports          Report[]
}

model Report {
  id            String         @id @default(cuid())
  title         String
  description   String
  type          ReportType
  category      Category       @default(OTHERS)
  location      String
  incidentDate  DateTime
  imageUrl      String?
  reporterId    String
  contactMethod ContactMethod
  status        ReportStatus   @default(ACTIVE)
  createdAt     DateTime       @default(now())

  reporter User @relation(fields: [reporterId], references: [id])

  @@index([type])
  @@index([category])
  @@index([location])
}
```
