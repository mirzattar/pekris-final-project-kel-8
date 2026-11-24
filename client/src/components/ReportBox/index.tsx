import Styles from "./index.module.css"
import { Link } from "react-router"
import type { Report } from "../../services/reportApi"
import type { CSSProperties } from "react"

interface Props {
	data: Report
	expanded?: boolean
}

export default function ReportBox({ data, expanded = false }: Props) {
	const style = {
		"--box-color": data.type === "LOST" ? "crimson" : "lightgreen"
	} as CSSProperties

	return (
		<Link
			to={ `/reports/${data.id}` }
			onClick={ () => window.scrollTo(0, 0) }
			className={ `${Styles.report_box} ${expanded ? Styles.report_box_expanded : ""}` }
			style={ style }
		>
			<h3 className={ Styles.report_title }>{ data.title }</h3>
			<dl>
				<dt className={ Styles.report_desc_term }>Location</dt>
				<dd className={ Styles.report_desc_detail }>{ data.location }</dd>
				<dt className={ Styles.report_desc_term }>Date { data.type.toLowerCase() }</dt>
				<dd className={ Styles.report_desc_detail }><time dateTime={ data.incidentDate }>{ data.incidentDate }</time></dd>
				{
					expanded && <>
						<dt className={ Styles.report_desc_term }>Category</dt>
						<dd className={ Styles.report_desc_detail }>{ data.category }</dd>
						<dt className={ Styles.report_desc_term }>Status</dt>
						<dd className={ Styles.report_desc_detail }>{ data.status }</dd>
						<dt className={ Styles.report_desc_term }>Type</dt>
						<dd className={ Styles.report_desc_detail }>{ data.type }</dd>
					</>
				}
			</dl>
		</Link>
	)
}
