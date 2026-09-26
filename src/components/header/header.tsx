import { Skeleton } from '@repo/core'
import { Suspense } from 'react'

import { AuthStatusSlot } from '#/components/auth-status'
import { Logo, MainNav } from '#/components/navigation'

export function Header() {
	return (
		<header className={`
			sticky top-0 z-40 hidden items-center justify-between gap-8 bg-gray-ultralight/85 px-5
			py-4 backdrop-blur-md
			lg:flex
		`}>
			<Logo />

			<MainNav />

			<div className="flex items-center justify-end">
				<Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
					<AuthStatusSlot />
				</Suspense>
			</div>
		</header>
	)
}
