'use client'

import { cn, Skeleton } from '@repo/core'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useIsHydrated } from '#/hooks/use-is-hydrated'

interface ThemeToggleProps {
	className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme()
	const isHydrated = useIsHydrated()

	if (!isHydrated) {
		return <Skeleton className={cn('size-5 rounded-lg', className)} />
	}

	return (
		<button type="button" aria-label="Переключить тему" className={cn(`
			relative inline-flex cursor-pointer items-center justify-center transition-opacity
			duration-200
			hover:opacity-70
		`, className)} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
			<SunIcon className={`
				size-5 scale-100 rotate-0 transition-transform duration-300
				dark:scale-0 dark:-rotate-90
			`} />
			<MoonIcon className={`
				absolute size-5 scale-0 rotate-90 transition-transform duration-300
				dark:scale-100 dark:rotate-0
			`} />
		</button>
	)
}
