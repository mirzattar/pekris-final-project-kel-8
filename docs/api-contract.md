# API Contract

Lost & Found API. Node.js + Express 5 + TypeScript.

| Environment | Base URL |
| --- | --- |
| Production | `https://pekris-final-project-kel-8-production.up.railway.app` |
| Local | `http://localhost:3000` |

No authentication. All endpoints are public and read-only except `POST /reports`.

## Response envelope

Every response is a JSON object. Success:

```json
{ "data": { } }
```

List success adds `meta`:

```json
{ "data": [], "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 } }
```

Error:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid report data", "details": [] } }
```

`details` is present only for `INVALID_QUERY` and `VALIDATION_ERROR`. Each item is `{ "field": string, "message": string }`.

## Report object

```json
{
  "id": "report-001",
  "title": "Tumbler Hitam",
  "description": "Tumbler berwarna hitam dengan stiker panda.",
  "type": "LOST",
  "category": "BOTTLE",
  "location": "Kelas A 2.08",
  "incidentDate": "2026-11-15",
  "imageUrl": null,
  "reporterId": "user-001",
  "contactMethod": "EMAIL",
  "status": "ACTIVE",
  "createdAt": "2026-11-16T08:00:00Z"
}
```

### Enums

| Field | Values |
| --- | --- |
| `type` | `LOST`, `FOUND` |
| `category` | `BOTTLE`, `STATIONERY`, `ACCESSORIES`, `ELECTRONICS`, `DOCUMENTS`, `CLOTHING`, `OTHERS` |
| `contactMethod` | `EMAIL`, `WHATSAPP` |
| `status` | `ACTIVE`, `RESOLVED` |

`imageUrl` is always `null` for now. Image upload (Cloudinary) is not implemented yet; the frontend must show a placeholder when it is `null`.

## GET /

Health check.

```
curl https://pekris-final-project-kel-8-production.up.railway.app/
```

```json
{ "message": "Lost & Found API" }
```

`200 OK`.

## GET /reports

List reports, newest first by `createdAt`.

```
GET /reports?search=tumbler&type=LOST&category=BOTTLE&page=1&limit=10
```

### Query parameters

All optional. An empty value (`?type=`) is treated as absent.

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `search` | string | — | Case-insensitive match on `title` or `description`. Alias: `q`. If both are sent, `search` wins. |
| `type` | enum | — | Exact match. |
| `category` | enum | — | Exact match. |
| `location` | string | — | Case-insensitive substring match. |
| `status` | enum | — | Exact match. |
| `incidentDate` | `YYYY-MM-DD` | — | Exact match. Invalid dates are rejected. |
| `page` | integer ≥ 1 | `1` | 1-based page number. |
| `limit` | integer 1–100 | `10` | Page size. Values above 100 are rejected, not clamped. |

Repeating a parameter (`?search=a&search=b`) returns `400 INVALID_QUERY`.

### Response

`200 OK`

```json
{
  "data": [ { "id": "report-006" } ],
  "meta": { "page": 1, "limit": 2, "total": 10, "totalPages": 5 }
}
```

`totalPages` is `0` when no report matches. A `page` beyond the last page returns `data: []` with the requested value echoed in `meta.page`.

```
curl "https://pekris-final-project-kel-8-production.up.railway.app/reports?limit=2&type=LOST"
```

## GET /reports/:id

```
GET /reports/report-001
```

`200 OK`

```json
{
  "data": {
    "id": "report-001",
    "title": "Tumbler Hitam",
    "contactMethod": "EMAIL",
    "reporter": {
      "name": "Andi Pratama",
      "contact": { "method": "EMAIL", "value": "andi@example.com" }
    }
  }
}
```

The `reporter` object is returned by this endpoint only. `GET /reports` never includes it, so contacts cannot be harvested in bulk.

`reporter.contact` contains exactly one method: the one the reporter selected for that report (`report.contactMethod`). The other method is never returned. A report with `contactMethod: "WHATSAPP"` returns the WhatsApp number and no email, and the reverse.

`reporter` is `null` when `reporterId` matches no user.

Seed data uses fictional contacts only: `@example.com` addresses and non-dialable WhatsApp placeholders, so no real person can be reached.

`404 Not Found` when the id does not exist:

```json
{ "error": { "code": "REPORT_NOT_FOUND", "message": "Report not found" } }
```

## POST /reports

Create a text-only report. `Content-Type: application/json`.

```
curl -X POST "https://pekris-final-project-kel-8-production.up.railway.app/reports" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kunci Motor",
    "description": "Kunci dengan gantungan biru",
    "type": "FOUND",
    "category": "ACCESSORIES",
    "location": "Pos Satpam F",
    "incidentDate": "2026-11-20",
    "reporterId": "user-002",
    "contactMethod": "WHATSAPP"
  }'
```

### Body

All fields required. `status` is always set to `ACTIVE` and `imageUrl` to `null` by the server. Both are rejected if sent, along with every other field not listed below.

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | Non-empty after trim, at most 120 characters. |
| `description` | string | Non-empty after trim, at most 2000 characters. |
| `type` | enum | `LOST` or `FOUND`. |
| `category` | enum | One of the seven categories. |
| `location` | string | Non-empty after trim, at most 120 characters. |
| `incidentDate` | string | Valid `YYYY-MM-DD` calendar date, not in the future. |
| `reporterId` | string | Must exist in the seeded users. |
| `contactMethod` | enum | `EMAIL` or `WHATSAPP`. |

### Responses

`201 Created` — the created report, same shape as the Report object.

`400 Bad Request` — one or more field errors are collected into `details`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid report data",
    "details": [ { "field": "type", "message": "type must be LOST or FOUND" } ]
  }
}
```

A `reporterId` that passes the string check but matches no user returns the same `VALIDATION_ERROR` shape with `details: [{ "field": "reporterId", "message": "reporterId does not exist" }]`.

## Report modification

The API exposes no `PUT`, `PATCH`, or `DELETE` route for reports, so a public visitor cannot edit or delete an existing report. The only write operation is `POST /reports`, which always creates a new report.

There is no authentication in this checkpoint. `reporterId` is supplied by the client and is validated only against the seeded users, so the API cannot prove that the submitter is that user. Adding authentication would be required before reports can be tied to a verified account.

## Error codes

| HTTP | `code` | Cause |
| --- | --- | --- |
| 400 | `INVALID_QUERY` | Invalid or repeated query parameter in `GET /reports`. |
| 400 | `VALIDATION_ERROR` | Invalid field in the `POST /reports` body. |
| 400 | `INVALID_JSON` | Request body is not parseable JSON. |
| 404 | `REPORT_NOT_FOUND` | No report with the requested id. |
| 404 | `NOT_FOUND` | Unknown route. |
| 413 | `PAYLOAD_TOO_LARGE` | Request body exceeds the parser limit. |
| 500 | `INTERNAL_ERROR` | Unhandled server error. Message is never leaked to the client. |

## CORS

Allowed origins are read from the `CORS_ORIGIN` environment variable, comma-separated:

```
CORS_ORIGIN=http://localhost:5173,https://<frontend-domain>
```

When `CORS_ORIGIN` is unset, every origin is allowed (`*`). Trailing slashes are not stripped, so list origins without one. A request from an origin not in the list gets no `Access-Control-Allow-Origin` header and the browser blocks it.

## Storage

Reports are stored in PostgreSQL through Prisma and survive restarts and redeploys. There is no in-memory fallback.

The ten seeded reports use readable ids such as `report-001`. Reports created through `POST /reports` receive a generated id such as `cmwvnvt2y0001qt017h5f3lmf`. Do not assume the `report-` prefix; treat `id` as an opaque string.

## Running locally

```
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

`prisma migrate dev` creates the tables and `db seed` loads the five users and ten reports from `mock/`. Both need a working `DATABASE_URL`.

Build and run production:

```
cd server
npx prisma generate
npm run build
npm start
```

## Deployment

Hosted on Railway, with a Railway PostgreSQL database attached to the same project.

| Setting | Value |
| --- | --- |
| Root Directory | `/` (repository root) |
| Build Command | `cd server && npm ci && npx prisma generate && npm run build` |
| Start Command | `cd server && npx prisma migrate deploy && node dist/index.js` |
| Variable | `DATABASE_URL=${{Postgres.DATABASE_URL}}` |
| Variable | `CORS_ORIGIN=http://localhost:5173,<frontend-domain>` |

`migrate deploy` runs on every start and applies pending migrations. `DATABASE_URL` must reference the database over Railway's private network, not the public TCP proxy.

Railway injects `PORT`. Do not set it manually.
