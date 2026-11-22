import Styles from "./index.module.css"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import type { PropsWithChildren } from "react"
import type { Routes } from "../../main"

interface Props extends PropsWithChildren {
	currentRoute: Routes
}

export default function PrimaryLayout({ children, currentRoute }: Props) {
	return (
		<div id="app" className={ `${Styles.container}` }>
			<Navbar currentRoute={ currentRoute } />
			<main className={ `${Styles.main}` }>{ children }</main>
			<Footer />
		</div>
	)
}
