import type { SVGProps } from 'react'

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M21.5 3.5 2.5 11l6 2.3M21.5 3.5 18.8 20.5l-10.3-7.2M21.5 3.5 8.5 13.3v6l3.2-3.3" />
		</svg>
	)
}
