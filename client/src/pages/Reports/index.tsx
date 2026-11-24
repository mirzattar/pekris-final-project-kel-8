import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import Browse from "../../components/Browse"
import ErrorScreen from "../../components/ErrorScreen"
import ReportBox from "../../components/ReportBox"
import SearchBox from "../../components/SearchBox"
import { getReportById, getReports, type Report, type ReportFilters } from "../../services/reportApi"
import Styles from "./index.module.css"

function getPositiveInteger(value: string | null): number | undefined {
	if (!value) return undefined
	const parsed = Number(value)
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

function getReportFilters(query: string): ReportFilters {
	const params = new URLSearchParams(query)
	const getValue = (key: string) => params.get(key)?.trim() || undefined
	const getUpperValue = (key: string) => getValue(key)?.toUpperCase()

	return {
		search: getValue("search")?.toLowerCase(),
		type: getUpperValue("type"),
		category: getUpperValue("category"),
		location: getValue("location")?.toLowerCase(),
		status: getUpperValue("status"),
		incidentDate: getValue("incidentDate"),
		page: getPositiveInteger(params.get("page")) ?? 1,
		limit: Math.min(getPositiveInteger(params.get("limit")) ?? 10, 100)
	}
}

export default function Reports() {
	const { reportId } = useParams()
	const navigate = useNavigate()
	const [ searchParams ] = useSearchParams()
	const limitInputRef = useRef<HTMLInputElement>(null)
	const query = searchParams.toString()
	const filters = getReportFilters(query)
	const searchQuery = searchParams.get("search")?.trim() ?? ""
	const hasFilters = Boolean(filters.search || filters.type || filters.category || filters.location || filters.status || filters.incidentDate)
	const currentPage = filters.page ?? 1
	const currentLimit = filters.limit ?? 10
	const queryKey = reportId ? `report:${reportId}` : `filters:${query}`
	const [ result, setResult ] = useState<{
		key: string
		status: "loading" | "success" | "error"
		reports: Report[]
	}>({ key: queryKey, status: "loading", reports: [] })

	useEffect(() => {
		let isCurrent = true

		const loadReports = async () => {
			try {
				const reports = reportId
					? [ await getReportById(reportId) ]
					: await getReports(getReportFilters(query))
				if (isCurrent) setResult({ key: queryKey, status: "success", reports })
			} catch {
				if (isCurrent) setResult({ key: queryKey, status: "error", reports: [] })
			}
		}

		void loadReports()
		return () => {
			isCurrent = false
		}
	}, [ queryKey, reportId, query ])

	const currentResult = result.key === queryKey
		? result
		: { key: queryKey, status: "loading" as const, reports: [] }

	const navigateToPage = (page: number) => {
		const requestedLimit = Number(limitInputRef.current?.value ?? currentLimit)
		const isValidLimit = Number.isSafeInteger(requestedLimit) && requestedLimit > 0
		const limit = isValidLimit ? Math.min(requestedLimit, 100) : currentLimit
		if (!isValidLimit && limitInputRef.current) {
			limitInputRef.current.value = String(currentLimit)
		}
		const params = new URLSearchParams(searchParams)
		params.set("page", String(limit === currentLimit ? page : 1))
		params.set("limit", String(limit))
		navigate(`/reports?${params.toString()}`)
	}

	if (!reportId) {
		if (currentResult.status === "error") return <ErrorScreen kind="noReportsFound" />

		return (
			<>
				<h1 className={ Styles.heading }>
					{ searchQuery
						? `Search results for "${searchQuery}"`
						: hasFilters ? "Filtered reports" : "All reports" }
				</h1>
				<SearchBox />
				<Browse seeAllBtn={ false }>
					{ currentResult.status === "loading"
						? <p role="status">Loading reports...</p>
						: currentResult.reports.length > 0
							? currentResult.reports.map(data => <ReportBox key={ data.id } data={ data } expanded={ true } />)
							: <p role="status">No reports found.</p> }
				</Browse>
				<nav className={ Styles.pagination } aria-label="Report pages">
					<button
						type="button"
						disabled={ currentPage <= 1 || currentResult.status === "loading" }
						onClick={ () => navigateToPage(currentPage - 1) }
					>
						Previous
					</button>
					<label className={ Styles.page_size }>
						Results per page
						<input
							key={ currentLimit }
							ref={ limitInputRef }
							type="number"
							min="1"
							max="100"
							defaultValue={ currentLimit }
							aria-label="Results per page"
							onKeyDown={ event => {
								if (event.key === "Enter") {
									event.preventDefault()
									navigateToPage(1)
								}
							} }
						/>
					</label>
					<button
						type="button"
						disabled={ currentResult.status !== "success" || currentResult.reports.length < currentLimit }
						onClick={ () => navigateToPage(currentPage + 1) }
					>
						Next
					</button>
					<span className={ Styles.current_page } aria-live="polite">Page { currentPage }</span>
				</nav>
			</>
		)
	}

	if (currentResult.status === "error") return <ErrorScreen kind="noReportIdFound" />
	if (currentResult.status === "loading") return <p role="status">Loading report...</p>

	const report: Report | null = currentResult.reports[ 0 ] ?? null
	if (!report) return <ErrorScreen kind="noReportIdFound" />

	return (
		<div className={ Styles.container }>
			<div className={ Styles.report_title_container }>
				<h1 className={ Styles.report_title }>{ report.title }</h1>
				<div className={ Styles.report_badges }>
					<span className={ `${Styles.report_subtitle} ${report.type === "LOST" ? Styles.report_subtitle_lost : Styles.report_subtitle_found}` }>
						{ report.type }
					</span>
					<span className={ Styles.report_status }>{ report.status }</span>
				</div>
			</div>
			<div className={ Styles.report_display }>
				<div className={ Styles.report_main }>
					<section className={ Styles.report_media } aria-label="Report image">
						{ report.imageUrl
							? <img className={ Styles.report_image } src={ report.imageUrl } alt={ report.title } />
							: <div className={ Styles.image_placeholder }>No image available</div> }
					</section>
					<section className={ Styles.report_description }>
						<h2>Description</h2>
						<p>{ report.description }</p>
					</section>
				</div>
				<section className={ Styles.report_details }>
					<h2>Details</h2>
					<dl className={ Styles.report_details_list }>
						<dt>Report ID</dt>
						<dd>{ report.id }</dd>
						<dt>Type</dt>
						<dd>{ report.type }</dd>
						<dt>Status</dt>
						<dd>{ report.status }</dd>
						<dt>Category</dt>
						<dd>{ report.category }</dd>
						<dt>Location</dt>
						<dd>{ report.location }</dd>
						<dt>Date lost/found</dt>
						<dd><time dateTime={ report.incidentDate }>{ report.incidentDate }</time></dd>
						<dt>Contact method</dt>
						<dd>{ report.contactMethod }</dd>
						<dt>Report created at</dt>
						<dd><time dateTime={ report.createdAt }>{ report.createdAt }</time></dd>
					</dl>
				</section>
			</div>
		</div>
	)
}
