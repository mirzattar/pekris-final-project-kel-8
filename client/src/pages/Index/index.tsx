import Styles from "./index.module.css"
import Browse from "../../components/Browse"
import ReportBox from "../../components/ReportBox"
import { getReports, type Report } from "../../services/reportApi"
import { useEffect, useState } from "react"
import SearchBox from "../../components/SearchBox"
import ErrorScreen from "../../components/ErrorScreen"

export default function Index() {
	const [ reports, setReports ] = useState<Report[]>([])
	const [ hasLoadError, setHasLoadError ] = useState(false)

	useEffect(() => {
		let isCurrent = true
		getReports({ status: "ACTIVE", limit: 3 })
			.then(data => {
				if (isCurrent) setReports(data)
			})
			.catch(() => {
				if (isCurrent) setHasLoadError(true)
			})

		return () => {
			isCurrent = false
		}
	}, [])

	return (
		<div className={ Styles.container }>
			<h1 className={ Styles.heading }>Find your missing item</h1>
			<SearchBox />
			<h2 className={ Styles.heading }>View recently-reported items</h2>
			<Browse seeAllBtn={ true }>
				{ hasLoadError
					? <ErrorScreen kind="noReportsFound" />
					: reports.map(report => <ReportBox key={ report.id } data={ report } />) }
			</Browse>
		</div>
	)
}
