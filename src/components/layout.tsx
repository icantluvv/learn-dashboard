import { Header } from '#/components/header'
import { MobileHeader } from '#/components/mobile-header'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-ultralight py-20">
			<Header />
			<MobileHeader />
			{children}
		</div>
	)
}
