import { Link } from "react-router"
import Styles from "./index.module.css"

export default function Footer() {
	return (
		<footer className={ Styles.footer }>
			<div className={ Styles.logo }>
				<Link to="/">BarangSiapa‽</Link>
			</div>
			<div className={ Styles.description }>
				Find and report lost or found items.
			</div>
		</footer>
	)
}
