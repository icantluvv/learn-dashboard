import { Skeleton } from '@repo/core'
import { Suspense } from 'react'

import { BottomNav, ProfileTabSlot } from '#/components/bottom-nav'
import { Header } from '#/components/header'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="v-stack min-h-screen bg-gray-ultralight">
			<Header />

			<div className={`
				flex flex-1 flex-col pt-6 pb-28
				lg:pt-8 lg:pb-16
			`}>{children}</div>

			<BottomNav
				profile={
					<Suspense fallback={<Skeleton className="size-6 rounded-full" />}>
						<ProfileTabSlot />
					</Suspense>
				}
			/>
		</div>
	)
}
