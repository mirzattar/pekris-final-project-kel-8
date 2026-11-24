import { createContext, useContext, type Dispatch, type SetStateAction } from "react"

interface SearchData {
	query: string
	setQuery: Dispatch<SetStateAction<string>>
}

const SearchContext = createContext<SearchData | null>(null)

export function useSearch() {
	const context = useContext(SearchContext)
	if (!context) throw new Error("Context hook not used within provider")
	return context
}
