import type { ButtonHTMLAttributes, MouseEventHandler, PropsWithChildren } from "react"
import Styles from "./index.module.css"

interface Props extends PropsWithChildren {
	onClick?: MouseEventHandler<HTMLButtonElement>
	type?: ButtonHTMLAttributes<HTMLButtonElement>[ "type" ]
	disabled?: boolean
}

export default function StyledButton({ children, onClick, type = "button", disabled = false }: Props) {
	return (
		<button type={ type } className={ Styles.button } onClick={ onClick } disabled={ disabled }>{ children }</button>
	)
}
