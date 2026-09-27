import { Skeleton } from '@repo/core'
import { Suspense } from 'react'

import { AuthStatusSlot } from '#/components/auth-status'
import { Logo, MainNav } from '#/components/navigation'
import { ThemeToggle } from '#/components/theme-toggle'

export function Sidebar() {
	return (
		<aside className={`
			sticky top-0 hidden h-screen w-full flex-col gap-8 overflow-y-auto rounded-r-4xl
			bg-sidebar p-6
			lg:flex
		`}>
			<div className="flex items-center justify-between">
				<Logo />

				<ThemeToggle />
			</div>

			<MainNav className="flex-col items-start gap-2" />

			<div className="mt-auto v-stack gap-4">
				<Suspense fallback={<Skeleton className="size-10 rounded-full" />}>
					<AuthStatusSlot />
				</Suspense>
			</div>
		</aside>
	)
}
