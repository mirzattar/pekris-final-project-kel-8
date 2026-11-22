import type { FromSchema } from "json-schema-to-ts"
import type rawReportSchema from "../schemas/report.schema"
import type rawUserSchema from "../schemas/user.schema"

export type ReportId = `report-${number}`
export type AppReport = FromSchema<typeof rawReportSchema>
export type AppUser = FromSchema<typeof rawUserSchema>
export type Assertion<T> = (val: unknown) => asserts val is T
