import { BottomNav } from '#/components/bottom-nav'
import { Header } from '#/components/header'
import { PwaInstallBanner } from '#/components/pwa-install'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="v-stack min-h-screen bg-gray-ultralight">
			<Header />

			<div className={`
				flex flex-1 flex-col pt-[max(1.5rem,env(safe-area-inset-top))] pb-32
				lg:pt-8 lg:pb-16
			`}>{children}</div>

			<PwaInstallBanner />

			<BottomNav />
		</div>
	)
}
