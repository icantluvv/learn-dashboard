import { Suspense } from 'react'

import { AuthStatusSlot } from '#/components/auth-status'
import { Header } from '#/components/header'
import { MobileHeader } from '#/components/mobile-header'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-ultralight py-20">
			<Header />
			<MobileHeader />
			<div className="page-wrapper flex justify-end pb-4">
				<Suspense fallback={null}>
					<AuthStatusSlot />
				</Suspense>
			</div>
			{children}
		</div>
	)
}
