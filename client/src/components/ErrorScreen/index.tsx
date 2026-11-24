import Styles from "./index.module.css"
import StyledButton from "../StyledButton"

type ErrorKinds = "noReportsFound" | "noReportIdFound"

interface Props {
	kind: ErrorKinds
}

export default function ErrorScreen({ kind }: Props) {
	return (
		<div className={ Styles.error_box }>
			<div className={ Styles.error_text }>
				Error while loading { kind === "noReportIdFound" ? "report" : "reports" }.
			</div>
			<StyledButton onClick={ () => window.location.reload() }>Reload</StyledButton>
		</div>
	)
}
