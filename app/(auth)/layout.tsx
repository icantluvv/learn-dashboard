import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="v-stack min-h-screen bg-gray-ultralight">
			<div className={`
				flex flex-1 flex-col pt-[max(1.5rem,env(safe-area-inset-top))]
				pb-[max(1.5rem,env(safe-area-inset-bottom))]
				lg:pt-8 lg:pb-8
			`}>{children}</div>
		</div>
	)
}
