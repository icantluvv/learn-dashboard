import type { LucideIcon } from 'lucide-react'
import type { Route } from 'next'

import { HouseIcon, LayoutGridIcon, MenuIcon, UserRoundIcon } from 'lucide-react'

export interface NavLink {
	href: Route
	icon: LucideIcon
	label: string
}

export const NAV_LINKS: readonly NavLink[] = [
	{ href: '/', icon: HouseIcon, label: 'Главная' },
	{ href: '/catalog', icon: LayoutGridIcon, label: 'Каталог' },
	{ href: '/profile', icon: UserRoundIcon, label: 'Профиль' },
]

// Кнопка «Меню» открывает AccountDrawer и не ведёт на маршрут, поэтому у неё нет `href`.
export const BOTTOM_NAV_MENU_ACTION: Omit<NavLink, 'href'> = {
	icon: MenuIcon,
	label: 'Меню',
}
