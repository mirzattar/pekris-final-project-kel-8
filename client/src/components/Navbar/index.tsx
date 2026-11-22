import { DropdownMenu } from "radix-ui"
import { Cross1Icon, HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons"
import Styles from "./index.module.css"
import { useState } from "react"
import type { Routes } from "../../main"
import { Avatar } from "radix-ui"
import ThemeToggle from "../ThemeToggle"

interface Props {
	currentRoute: Routes
}

export default function Navbar({ currentRoute }: Props) {
	const [ sidebarExpanded, setSidebarExpanded ] = useState(false)

	return (
		<nav className={ Styles.nav_container }>
			<div className={ Styles.logo_container }>
				<h1 style={ { fontWeight: "var(--fg-w-bold)" } }>
					<a href="/">Logo</a>
				</h1>
			</div>
			<div className={ Styles.right_container }>
				<div className={ Styles.toggle_sidebar } onClick={ () => setSidebarExpanded(() => !sidebarExpanded) }>
					{
						sidebarExpanded ? <Cross1Icon className={ `${Styles.sidebar_toggle_icon} icon-thick icon-color-accent` } width={ 30 } /> : <HamburgerMenuIcon className={ `${Styles.sidebar_toggle_icon} icon-thick icon-color-accent` } width={ 30 } />
					}
				</div>
				<aside className={ `${Styles.sidebar} ${sidebarExpanded ? Styles.expanded : null}` }>
					<ul className={ Styles.menu_list }>
						<li className={ `${Styles.menu_item} ${currentRoute === "/" && Styles.active_route}` }>
							<a href="/">Home</a>
						</li>
						<li className={ `${Styles.menu_item} ${currentRoute === "/report" && Styles.active_route}` }>
							<a href="/report">Report Lost Item</a>
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
										<a href="/account" className={ Styles.profile_dropdown_link }>Account</a>
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
