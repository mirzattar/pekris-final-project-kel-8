import { Label } from "radix-ui"
import Styles from "./index.module.css"
import mockData from "../../../../mock/reports.json"
import type { AppReport } from "../../../../types/global"
import type React from "react"
import { Link } from "react-router"

interface Props {

}

const SearchBox = () => {
	return (
		<div className={ Styles.search_box }>
			<Label.Root className={ Styles.search_label }>
				Search using item name, type, location, and more
				<input type="search" name="searchInput" className={ Styles.search_input } id="searchInput" />
			</Label.Root>
		</div>
	)
}

interface ReportBoxProps extends Pick<AppReport, "id" | "location" | "type" | "incidentDate" | "title"> { }

const ReportBox = ({ id, location, incidentDate, type, title }: ReportBoxProps) => {
	const colors = [ 2, 3, 4, 5, 6 ]
	const style = {
		"--box-color": `var(--accent-${colors[ Math.floor(Math.random() * colors.length) ]})`
	} as React.CSSProperties
	return (
		<Link to={ `/reports/${id}` } onClick={ () => window.scrollTo(0, 0) }>
			<div className={ Styles.report_box } style={ style }>
				<h3 className={ Styles.report_title }>{ title }</h3>
				<dl>
					<dt className={ Styles.report_desc_term }>Location</dt>
					<dd className={ Styles.report_desc_detail }>{ location }</dd>
					<dt className={ Styles.report_desc_term }>Date { type.toLowerCase() }</dt>
					<dd className={ Styles.report_desc_detail }><time dateTime={ incidentDate }>{ incidentDate }</time> { status }</dd>
				</dl>
			</div>
		</Link>
	)
}

const Browse = () => {
	return (
		<div className={ Styles.browse }>
			<h2 className={ Styles.heading }>Browse recently-reported items</h2>
			<div className={ Styles.browse_list }>
				{
					mockData.map((data) => data.status === "ACTIVE" && <ReportBox id={ data.id } incidentDate={ data.incidentDate } location={ data.location } title={ data.title } type={ ((data.type) as "FOUND" | "LOST") } key={ data.id } />)
				}
			</div>
			<Link to="/reports" onClick={ () => window.scrollTo(0, 0) } style={ { margin: '0 auto' } }>
				<button className={ Styles.browse_button }>See all reports</button>
			</Link>
		</div>
	)
}

export default function Index(props: Props) {
	return (
		<div className={ Styles.container }>
			<h1 className={ Styles.heading }>Find your missing item</h1>
			<SearchBox />
			<Browse />
		</div>
	)
}
