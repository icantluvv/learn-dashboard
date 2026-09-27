'use client'

import { useBreakpoints } from '#/hooks/use-breakpoints'

import { DesktopFiltersSidebar } from './desktop-filters-sidebar'
import { MobileFiltersDrawer } from './mobile-filters-drawer'

export function SidebarFilters() {
	const { gtMd } = useBreakpoints()

	if (gtMd) {
		return <DesktopFiltersSidebar />
	}

	return <MobileFiltersDrawer />
}
