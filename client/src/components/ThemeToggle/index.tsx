import { Switch } from "radix-ui"
import Styles from "./index.module.css"
import { useEffect } from "react"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"
import { useLocalStorage } from "@uidotdev/usehooks"
import type { Themes } from "../../contexts/ThemeContext"

export default function ThemeToggle() {
	const [ theme, saveTheme ] = useLocalStorage<Themes>("theme", "light")

	useEffect(() => {
		document.documentElement.classList.remove("theme-light", "theme-dark")
		document.documentElement.classList.add(`theme-${theme}`)
	}, [ theme ])

	const handleCheck = (checked: boolean) => {
		saveTheme(checked ? "dark" : "light")
	}

	return (
		<Switch.Root
			className={ Styles.theme_toggle_root }
			checked={ theme === "dark" }
			onCheckedChange={ handleCheck }
			aria-label="Toggle dark theme"
		>
			<Switch.Thumb asChild className={ Styles.theme_toggle_thumb }>
				{ theme === "light" ? <SunIcon /> : <MoonIcon /> }
			</Switch.Thumb>
		</Switch.Root>
	)
}
