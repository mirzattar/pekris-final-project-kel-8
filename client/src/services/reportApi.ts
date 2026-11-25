const API_URL = (
	import.meta.env.VITE_API_URL ||
	(import.meta.env.DEV
		? "http://localhost:3000"
		: "https://pekris-final-project-kel-8-production.up.railway.app")
).replace(/\/+$/, "")

export type ReportsMeta = {
	page: number
	limit: number
	total: number
	totalPages: number
}

type ApiError = {
	code: string
	message: string
	details?: { field: string; message: string }[]
}

type ApiResponse<T> =
	| { data: T; meta?: ReportsMeta }
	| { error: ApiError }

async function requestData<T>(
	path: string,
	options: RequestInit,
	fallbackMessage: string
): Promise<{ data: T; meta?: ReportsMeta }> {
	const response = await fetch(`${API_URL}${path}`, options)
	const result: ApiResponse<T> = await response.json()

	if (!response.ok) {
		if ("error" in result) {
			const details = result.error.details
				?.map(({ field, message }) => `${field}: ${message}`)
				.join("; ")
			throw new Error(
				details ? `${result.error.message}: ${details}` : result.error.message
			)
		}
		throw new Error(fallbackMessage)
	}

	if (!("data" in result)) {
		throw new Error(`Invalid API response from ${path}`)
	}

	return result
}

export type Report = {
	id: string
	title: string
	description: string
	type: string
	category: string
	location: string
	incidentDate: string
	imageUrl: string | null
	reporterId: string
	contactMethod: string
	createdAt: string
	status: string
}


export async function getReports(
	filters: ReportFilters = {}
): Promise<Report[]> {
	return (await getReportsPage(filters)).data
}

export async function getReportsPage(
	filters: ReportFilters = {}
): Promise<{ data: Report[]; meta: ReportsMeta }> {
	const params = new URLSearchParams()

	Object.entries(filters).forEach(([ key, value ]) => {
		if (value !== undefined && value !== "") {
			params.append(key, String(value))
		}
	})

	const path = `/reports?${params.toString()}`
	const result = await requestData<Report[]>(
		path,
		{},
		"Gagal mengambil data laporan"
	)

	if (!result.meta) {
		throw new Error("Invalid reports response: pagination metadata is missing")
	}

	return { data: result.data, meta: result.meta }
}

export async function getReportById(id: string): Promise<Report> {
	const result = await requestData<Report>(
		`/reports/${encodeURIComponent(id)}`,
		{},
		"Gagal mengambil detail laporan"
	)
	return result.data
}

export type CreateReportPayload = {
	title: string
	description: string
	type: "LOST" | "FOUND"
	category: string
	location: string
	incidentDate: string
	contactMethod: "EMAIL" | "WHATSAPP"
}

export async function createReport(
	report: CreateReportPayload
): Promise<Report> {
	const result = await requestData<Report>(
		"/reports",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(report),
		},
		"Gagal mengirim laporan"
	)
	return result.data
}

export type ReportFilters = {
	search?: string
	type?: string
	category?: string
	location?: string
	status?: string
	incidentDate?: string
	page?: number
	limit?: number
}
