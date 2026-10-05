import Image from 'next/image'
import Link from 'next/link'

import { BRAND_NAME } from '#/seo'

export function Logo() {
	return (
		<Link
			href="/"
			aria-label={`${BRAND_NAME} — на главную`}
			className="inline-flex items-center gap-2"
		>
			<Image src="/icon.svg" alt="" width={36} height={36} className={`
					size-9 shrink-0 rounded-lg
					dark:hidden
				`} />

			<Image src="/icon-dark.svg" alt="" width={36} height={36} className={`
					hidden size-9 shrink-0 rounded-lg
					dark:block
				`} />
		</Link>
	)
}
