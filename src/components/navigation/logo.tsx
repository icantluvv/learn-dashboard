import Link from 'next/link'

export function Logo() {
	return (
		<Link href="/" aria-label="Learn Frontend — на главную" className="flex items-center gap-2">
			<span
				aria-hidden="true"
				className="size-9 shrink-0 rounded-lg bg-heading/10 border-shaded"
			/>
		</Link>
	)
}
