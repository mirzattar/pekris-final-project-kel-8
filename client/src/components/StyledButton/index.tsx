import type { ButtonHTMLAttributes, MouseEventHandler, PropsWithChildren } from "react"
import Styles from "./index.module.css"

interface Props extends PropsWithChildren {
	onClick?: MouseEventHandler<HTMLButtonElement>
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
}

export default function StyledButton({ children, onClick, type = "button" }: Props) {
	return (
		<button type={ type } className={ Styles.button } onClick={ onClick }>{ children }</button>
	)
}
