import { useState, type PropsWithChildren } from "react"
import PrimaryLayout from "./layouts/PrimaryLayout"
import ThemeContext, { type Themes } from "./contexts/ThemeContext"
import type { Routes } from "./main"

interface Props extends PropsWithChildren {
	currentRoute: Routes
}

export default function App({ children, currentRoute }: Props) {
	const [ theme, setTheme ] = useState<Themes>('light')

	return (
		<ThemeContext value={ { theme, setTheme } }>
			<PrimaryLayout currentRoute={ currentRoute }>
				{ children }
			</PrimaryLayout>
		</ThemeContext>
	)
}
