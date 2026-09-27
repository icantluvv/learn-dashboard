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
				const Icon = link.icon

				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(`
							flex w-full items-center gap-3 rounded-full px-4 py-3 text-base
							transition-colors
							hover:bg-brand-secondary hover:text-heading
							aria-[current=page]:bg-brand-primary aria-[current=page]:text-white
						`, linkClassName)}
						onClick={onNavigate}
					>
						<Icon className="size-5 shrink-0" aria-hidden="true" />
						{link.label}
					</Link>
				)
			})}
		</nav>
	)
}
