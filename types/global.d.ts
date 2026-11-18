import type rawReportSchema from "../schemas/report.schema.json"
import type rawUserSchema from "../schemas/user.schema.json"

type SchemaSanitizer<
	S extends { properties: Record<string, { type: string }> }
> = {
		[ K in keyof S[ "properties" ] ]:
		S[ "properties" ][ K ][ "type" ]
	}

export type AppReport = SchemaSanitizer<typeof rawReportSchema>
export type AppUser = SchemaSanitizer<typeof rawUserSchema>


export { }
