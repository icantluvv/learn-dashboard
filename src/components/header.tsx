'use client'

import { MobileHeader } from '#/components/mobile-header'
import { useBreakpoints } from '#/hooks/use-breakpoints'

export function Header() {
	const { gtLg } = useBreakpoints()

	if (!gtLg) {
		return <MobileHeader />
	}

	return null
}
