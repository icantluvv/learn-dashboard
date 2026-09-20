'use client'

import { MobileHeader } from '#/components/mobile-header'
import { useBreakpoints } from '#/hooks/use-breakpoints'

export function Header() {
	const { gtLg } = useBreakpoints()

	if (!gtLg) {
		return <MobileHeader />
	}

	return <header className="fixed top-0 left-0 z-10 h-20 w-full bg-white" />
}
