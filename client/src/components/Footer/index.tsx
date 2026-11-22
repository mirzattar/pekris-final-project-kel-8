import Styles from "./index.module.css"

interface Props {

}

export default function Footer(props: Props) {
	return (
		<footer className={ Styles.footer }>
			<div className={ Styles.logo }>
				<a href="/">Logo</a>
			</div>
			<div className={ Styles.description }>
				Find and report your missing items easily, or report the missing items of others!
			</div>
		</footer>
	)
}
