import Index from "./pages/Index"
import Report from "./pages/Report"
import Reports from "./pages/Reports"
import Account from "./pages/Account"
import "@fontsource/poppins"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router"
import App from "./App"

export type Routes = "/" | "/account" | "/report" | "/reports"

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={ <App currentRoute="/"><Index /></App> } />
				<Route path="report" element={ <App currentRoute="/report"><Report /></App> } />
				<Route path="reports" element={ <App currentRoute="/reports"><Reports /></App> } />
				<Route path="reports/:reportId" element={ <App currentRoute="/reports"><Reports /></App> } />
				<Route path="account" element={ <App currentRoute="/account"><Account /></App> } />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)
