import { BottomNav } from '#/components/bottom-nav'
import { PwaInstallBanner } from '#/components/pwa-install'
import { Sidebar } from '#/components/sidebar'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className={`
			min-h-screen bg-gray-ultralight
			lg:grid lg:grid-cols-[1fr_5fr]
		`}>
			<Sidebar />

			<div className="v-stack min-h-screen">
				<div className={`
					flex flex-1 flex-col pt-[max(1.5rem,env(safe-area-inset-top))] pb-32
					lg:pt-8 lg:pb-16
				`}>{children}</div>

				<PwaInstallBanner />

				<BottomNav />
			</div>
		</div>
	)
}
