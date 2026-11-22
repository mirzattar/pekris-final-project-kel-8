import { useParams, useNavigate } from "react-router"
import type { AppReport } from "../../../../types/global"

// mock data
import mockData from "../../../../mock/reports.json"
import { useEffect, useState } from "react"

interface Props {

}

export default function Reports(props: Props) {
	const { reportId } = useParams()
	const [ report, setReport ] = useState<AppReport | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		console.log(reportId)
		if (reportId === "") {
			navigate("/reports")
		}
	}, [ reportId, navigate ])

	let found = false
	for (const report of mockData) {
		if (report.id === reportId) {
			setReport(report as AppReport)
			found = true
		}
	}

	if (!found) navigate("/reports")

	return (
		<>
			<h1>Reports</h1>
			<p>{ JSON.stringify(report) }</p>
		</>
	)
}
