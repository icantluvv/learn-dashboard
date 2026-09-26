'use client'

import type { ReactNode } from 'react'

import { cn } from '@repo/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isActiveRoute } from '#/components/navigation/is-active-route'
import { NAV_LINKS } from '#/components/navigation/nav-links'

interface BottomNavProps {
	profile: ReactNode
}

export function BottomNav({ profile }: BottomNavProps) {
	const pathname = usePathname()

	return (
		<nav aria-label="Основная навигация" className={`
			fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around gap-1 border-t
			border-border bg-card px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]
			text-card-foreground
			lg:hidden
		`}>
			{NAV_LINKS.map((link) => {
				const isActive = isActiveRoute(pathname, link.href)
				const Icon = link.icon

				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(`
							v-stack min-w-16 flex-1 items-center justify-center gap-1 rounded-lg
							py-1.5 text-xs transition-colors
							aria-[current=page]:font-semibold aria-[current=page]:text-heading
						`)}
					>
						<Icon className="size-6" aria-hidden="true" />
						{link.label}
					</Link>
				)
			})}

			<div className="v-stack min-w-16 flex-1 items-center justify-center gap-1 py-1.5">
				{profile}
			</div>
		</nav>
	)
}
