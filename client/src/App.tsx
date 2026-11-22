import React, { StrictMode, useState } from "react"
import PrimaryLayout from "./layouts/PrimaryLayout"
import ThemeContext, { type Themes } from "./contexts/ThemeContext"
import type { Routes } from "./main"

interface Props extends React.PropsWithChildren {
	currentRoute: Routes
}

export default function App({ children, currentRoute }: Props) {
	const [ theme, setTheme ] = useState<Themes>('light')

	return (
		<StrictMode>
			<ThemeContext value={ { theme, setTheme } }>
				<PrimaryLayout currentRoute={ currentRoute }>
					{ children }
				</PrimaryLayout>
			</ThemeContext>
		</StrictMode>
	)
}
