import Styles from "./index.module.css"
import { Link } from "react-router"
import type { PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
	seeAllBtn: boolean
}

export default function Browse({ children, seeAllBtn = false }: Props) {
	return (
		<div className={ Styles.browse }>
			<div className={ Styles.browse_list }>
				{ children }
			</div>
			{
				seeAllBtn && <Link to="/reports" onClick={ () => window.scrollTo(0, 0) } className={ Styles.browse_button }>
					See all reports
				</Link>
			}
		</div>
	)
}
