'use client'

import { cn } from '@repo/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isActiveRoute } from '#/components/navigation/is-active-route'
import { BOTTOM_NAV_ACCOUNT_LINK, NAV_LINKS } from '#/components/navigation/nav-links'

const BOTTOM_NAV_LINKS = [...NAV_LINKS, BOTTOM_NAV_ACCOUNT_LINK]

export function BottomNav() {
	const pathname = usePathname()

	return (
		<nav aria-label="Основная навигация" className={`
			fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around gap-1 border-t
			border-border bg-card px-2 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]
			text-card-foreground
			lg:hidden
		`}>
			{BOTTOM_NAV_LINKS.map((link) => {
				const isActive = isActiveRoute(pathname, link.href)
				const Icon = link.icon

				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(`
							v-stack min-h-14 min-w-16 flex-1 items-center justify-start gap-1.5
							py-1.5 text-xs text-heading/45 transition-colors
							aria-[current=page]:font-semibold aria-[current=page]:text-heading
						`)}
					>
						<Icon className="size-7" aria-hidden="true" />
						{link.label}
					</Link>
				)
			})}
		</nav>
	)
}
