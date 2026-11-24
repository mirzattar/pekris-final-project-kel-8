import { Label } from "radix-ui"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useNavigate, useSearchParams } from "react-router"
import Styles from "./index.module.css"

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

function getLimit(searchParams: URLSearchParams): number {
	const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT)
	return Number.isSafeInteger(limit) && limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT
}

export default function SearchBox() {
	const navigate = useNavigate()
	const [ searchParams ] = useSearchParams()
	const customFilterKeys = [ "type", "category", "location", "status", "incidentDate" ]
	const hasCustomFilters = customFilterKeys.some(key => Boolean(searchParams.get(key)?.trim()))

	return (
		<div className={ Styles.search_container }>
			<form
				key={ searchParams.toString() }
				className={ Styles.search_box }
				onSubmit={ event => {
					event.preventDefault()
					const params = new URLSearchParams()
					new FormData(event.currentTarget).forEach((value, key) => {
						const entry = String(value).trim()
						if (entry) params.set(key, entry)
					})
					params.set("limit", String(getLimit(searchParams)))
					const search = params.toString()
					navigate(`/reports${search ? `?${search}` : ""}`)
				} }
			>
				<Label.Root htmlFor="report-search" className={ Styles.search_label }>
					Search using item name, type, location, and more
				</Label.Root>
				<div className={ Styles.search_controls }>
					<input
						type="search"
						name="search"
						className={ Styles.search_input }
						id="report-search"
						defaultValue={ searchParams.get("search") ?? "" }
					/>
					<button type="submit" className={ Styles.search_button } aria-label="Search reports">
						<MagnifyingGlassIcon aria-hidden="true" />
					</button>
				</div>
				<details className={ Styles.filters } open={ hasCustomFilters }>
					<summary>Filters</summary>
					<div className={ Styles.filter_grid }>
						<label className={ Styles.filter_field } htmlFor="report-type">
							Type
							<select id="report-type" name="type" defaultValue={ searchParams.get("type")?.toUpperCase() ?? "" }>
								<option value="">Any type</option>
								<option value="LOST">Lost</option>
								<option value="FOUND">Found</option>
							</select>
						</label>
						<label className={ Styles.filter_field } htmlFor="report-category">
							Category
							<input id="report-category" name="category" type="search" defaultValue={ searchParams.get("category") ?? "" } />
						</label>
						<label className={ Styles.filter_field } htmlFor="report-location">
							Location
							<input id="report-location" name="location" type="search" defaultValue={ searchParams.get("location") ?? "" } />
						</label>
						<label className={ Styles.filter_field } htmlFor="report-status">
							Status
							<select id="report-status" name="status" defaultValue={ searchParams.get("status")?.toUpperCase() ?? "" }>
								<option value="">Any status</option>
								<option value="ACTIVE">Active</option>
								<option value="RESOLVED">Resolved</option>
							</select>
						</label>
						<label className={ Styles.filter_field } htmlFor="report-incident-date">
							Incident date
							<input id="report-incident-date" name="incidentDate" type="date" defaultValue={ searchParams.get("incidentDate") ?? "" } />
						</label>
					</div>
					<button
						type="button"
						className={ Styles.clear_filters }
						disabled={ !hasCustomFilters }
						onClick={ () => {
							const params = new URLSearchParams()
							const search = searchParams.get("search")?.trim()
							if (search) params.set("search", search)
							params.set("limit", String(getLimit(searchParams)))
							navigate(`/reports?${params.toString()}`)
						} }
					>
						Clear filters
					</button>
				</details>
			</form>
		</div>
	)
}
