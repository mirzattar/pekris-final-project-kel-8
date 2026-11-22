import { createContext, useContext, type Dispatch, type SetStateAction } from "react"

export type Themes = "light" | "dark"
interface Theme {
	theme: Themes
	setTheme: Dispatch<SetStateAction<Themes>>
}

const ThemeContext = createContext<Theme | null>(null)

export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) throw new Error("Context hook not used within provider")
	return context
}

export default ThemeContext
