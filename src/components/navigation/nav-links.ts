import type { LucideIcon } from 'lucide-react'
import type { Route } from 'next'

import { HouseIcon, LayoutGridIcon, UserIcon } from 'lucide-react'

export interface NavLink {
	href: Route
	icon: LucideIcon
	label: string
}

export const NAV_LINKS: readonly NavLink[] = [
	{ href: '/', icon: HouseIcon, label: 'Главная' },
	{ href: '/catalog', icon: LayoutGridIcon, label: 'Каталог' },
]

/**
 * Отдельно от `NAV_LINKS`: вкладка «Аккаунт» показывается только в мобильной нижней навигации
 * (`BottomNav`), десктопная шапка использует `AuthStatusSlot`/`ProfilePopover`.
 */
export const BOTTOM_NAV_ACCOUNT_LINK: NavLink = {
	href: '/profile',
	icon: UserIcon,
	label: 'Аккаунт',
}
