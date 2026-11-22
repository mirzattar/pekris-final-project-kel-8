import { Switch } from "radix-ui"
import Styles from "./index.module.css"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"
import { useLocalStorage } from "@uidotdev/usehooks"
import type { Themes } from "../../contexts/ThemeContext"

export default function ThemeToggle() {
	const [ theme, saveTheme ] = useLocalStorage<Themes>("theme", "light")
	const [ icon, setIcon ] = useState(theme === "light" ? <SunIcon /> : <MoonIcon />)

	useEffect(() => {
		if (document.documentElement.classList.toString().includes("theme-")) return
		document.documentElement.classList.add(`theme-${theme}`)
	}, [ theme ])

	const handleCheck = (checked: boolean) => {
		if (checked) {
			setIcon(<MoonIcon />)
			document.documentElement.classList.replace("theme-light", "theme-dark")
			saveTheme("dark")
		} else {
			setIcon(<SunIcon />)
			document.documentElement.classList.replace("theme-dark", "theme-light")
			saveTheme("light")
		}
	}

	return (
		<Switch.Root className={ Styles.theme_toggle_root } checked={ theme === "dark" } onCheckedChange={ handleCheck }>
			<Switch.Thumb asChild className={ Styles.theme_toggle_thumb }>{ icon }</Switch.Thumb>
		</Switch.Root>
	)
}
