import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
	return (
		<Link
			href="/"
			aria-label="Learn Frontend — на главную"
			className="inline-flex items-center gap-2"
		>
			<Image
				src="/icon.svg"
				alt=""
				width={36}
				height={36}
				className="size-9 shrink-0 rounded-lg"
			/>
		</Link>
	)
}
