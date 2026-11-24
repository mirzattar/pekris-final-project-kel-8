import { DropdownMenu } from "radix-ui"
import { Cross1Icon, HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons"
import Styles from "./index.module.css"
import { useState } from "react"
import type { Routes } from "../../main"
import { Avatar } from "radix-ui"
import ThemeToggle from "../ThemeToggle"
import { Link } from "react-router"

interface Props {
	currentRoute: Routes
}

export default function Navbar({ currentRoute }: Props) {
	const [ sidebarExpanded, setSidebarExpanded ] = useState(false)

	return (
		<nav className={ Styles.nav_container }>
			<div className={ Styles.logo_container }>
				<h1 style={ { fontWeight: "var(--fg-w-bold)" } }>
					<Link to="/">BarangSiapa‽</Link>
				</h1>
			</div>
			<div className={ Styles.right_container }>
				<button
					type="button"
					className={ Styles.toggle_sidebar }
					aria-label={ sidebarExpanded ? "Close navigation menu" : "Open navigation menu" }
					aria-expanded={ sidebarExpanded }
					onClick={ () => setSidebarExpanded(expanded => !expanded) }
				>
					{
						sidebarExpanded ? <Cross1Icon className={ `${Styles.sidebar_toggle_icon} icon-thick icon-color-accent` } width={ 30 } /> : <HamburgerMenuIcon className={ `${Styles.sidebar_toggle_icon} icon-thick icon-color-accent` } width={ 30 } />
					}
				</button>
				<aside className={ `${Styles.sidebar} ${sidebarExpanded ? Styles.expanded : ""}` }>
					<ul className={ Styles.menu_list }>
						<li className={ `${Styles.menu_item} ${currentRoute === "/" ? Styles.active_route : ""}` }>
							<Link to="/" aria-current={ currentRoute === "/" ? "page" : undefined } onClick={ () => setSidebarExpanded(false) }>Home</Link>
						</li>
						<li className={ `${Styles.menu_item} ${currentRoute === "/report" ? Styles.active_route : ""}` }>
							<Link to="/report" aria-current={ currentRoute === "/report" ? "page" : undefined } onClick={ () => setSidebarExpanded(false) }>Report Item</Link>
						</li>
						<li className={ `${Styles.menu_item} ${currentRoute.startsWith("/reports") ? Styles.active_route : ""}` }>
							<Link to="/reports" aria-current={ currentRoute.startsWith("/reports") ? "page" : undefined } onClick={ () => setSidebarExpanded(false) }>All Reports</Link>
						</li>
						<li className={ Styles.menu_item }>
							<ThemeToggle />
						</li>
						<li className={ Styles.menu_item }>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger className={ Styles.profile_icon }>
									<Avatar.Root>
										<PersonIcon />
										<Avatar.Fallback />
									</Avatar.Root>
								</DropdownMenu.Trigger>

								<DropdownMenu.Portal>
									<DropdownMenu.Content className={ Styles.profile_dropdown_content }>
										<Link to="/account" className={ Styles.profile_dropdown_link }>Account</Link>
										<DropdownMenu.Arrow className="DropdownMenuArrow" />
									</DropdownMenu.Content>
								</DropdownMenu.Portal>
							</DropdownMenu.Root>
						</li>
					</ul>
				</aside>
			</div>
		</nav>
	)
}
