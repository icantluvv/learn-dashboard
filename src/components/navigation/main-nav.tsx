'use client'

import type { NavLink } from './nav-links'

import { cn } from '@repo/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

import { isActiveRoute } from './is-active-route'
import { NAV_LINKS } from './nav-links'

interface MainNavProps {
	className?: string
	linkClassName?: string
	onNavigate?: () => void
}

interface MainNavLinkProps {
	isActive: boolean
	link: NavLink
	linkClassName?: string
	onNavigate?: () => void
}

const MainNavLink = memo(({ isActive, link, linkClassName, onNavigate }: MainNavLinkProps) => {
	const Icon = link.icon

	return (
		<Link href={link.href} aria-current={isActive ? 'page' : undefined} className={cn(`
			flex w-full items-center gap-3 rounded-full px-4 py-3 text-base transition-colors
			duration-200
			hover:bg-brand-secondary hover:text-heading
			aria-[current=page]:bg-brand-primary aria-[current=page]:text-white
		`, linkClassName)} onClick={onNavigate}>
			<Icon className="size-5 shrink-0" aria-hidden="true" />
			{link.label}
		</Link>
	)
})

MainNavLink.displayName = 'MainNavLink'

export function MainNav({ className, linkClassName, onNavigate }: MainNavProps) {
	const pathname = usePathname()

	return (
		<nav aria-label="Навигация" className={cn('flex items-center gap-6', className)}>
			{NAV_LINKS.map((link) => (
				<MainNavLink
					key={link.href}
					link={link}
					linkClassName={linkClassName}
					isActive={isActiveRoute(pathname, link.href)}
					onNavigate={onNavigate}
				/>
			))}
		</nav>
	)
}
