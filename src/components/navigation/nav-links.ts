import type { LucideIcon } from 'lucide-react'
import type { Route } from 'next'

import { HouseIcon, LayoutGridIcon, MenuIcon } from 'lucide-react'

export interface NavLink {
	href: Route
	icon: LucideIcon
	label: string
}

export const NAV_LINKS: readonly NavLink[] = [
	{ href: '/', icon: HouseIcon, label: 'Главная' },
	{ href: '/catalog', icon: LayoutGridIcon, label: 'Каталог' },
]

export const BOTTOM_NAV_MENU_LINK: NavLink = {
	href: '/profile',
	icon: MenuIcon,
	label: 'Меню',
}
