'use client'

import { cn } from '@repo/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isActiveRoute } from './is-active-route'
import { NAV_LINKS } from './nav-links'

interface MainNavProps {
	className?: string
	linkClassName?: string
	onNavigate?: () => void
}

export function MainNav({ className, linkClassName, onNavigate }: MainNavProps) {
	const pathname = usePathname()

	return (
		<nav aria-label="Основная навигация" className={cn('flex items-center gap-6', className)}>
			{NAV_LINKS.map((link) => {
				const isActive = isActiveRoute(pathname, link.href)

				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(`
							text-base transition-colors
							hover:text-heading
							aria-[current=page]:font-semibold aria-[current=page]:text-heading
						`, linkClassName)}
						onClick={onNavigate}
					>
						{link.label}
					</Link>
				)
			})}
		</nav>
	)
}
