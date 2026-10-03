'use client'

import { buttonVariants, Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@repo/core'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

import { AccountSummary } from '#/components/auth-status/account-summary'
import { useCurrentUser } from '#/components/auth-status/use-current-user'
import { Logo } from '#/components/navigation'
import { BOTTOM_NAV_MENU_ACTION } from '#/components/navigation/nav-links'
import { ThemeToggle } from '#/components/theme-toggle'

const MenuIcon = BOTTOM_NAV_MENU_ACTION.icon

export function AccountDrawer() {
	const user = useCurrentUser(null)

	return (
		<Drawer swipeDirection="right">
			<DrawerTrigger
				render={
					<button type="button" className={`
						v-stack min-h-14 min-w-16 flex-1 items-center justify-start gap-1.5 py-1.5
						text-xs text-heading/45 transition-colors
					`}>
						<MenuIcon className="size-7" aria-hidden="true" />
						{BOTTOM_NAV_MENU_ACTION.label}
					</button>
				}
			/>

			<DrawerContent
				className="rounded-none! border-l-0 bg-sidebar"
				style={{
					['--drawer-content-width' as string]: '100vw',
					['--drawer-content-max-height' as string]: '100dvh',
					['--drawer-content-height' as string]: '100dvh',
				}}
			>
				<div className="v-stack h-full gap-8 p-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
					<DrawerClose
						render={
							<button type="button" aria-label="Закрыть меню" className={`
								-m-2.5 grid size-11 shrink-0 cursor-pointer place-items-center
								self-start rounded-full transition-[opacity,transform] duration-150
								outline-none select-none
								focus-visible:ring-3 focus-visible:ring-ring/50
								active:-translate-x-0.5 active:scale-90 active:opacity-45
								motion-reduce:transition-none
								motion-reduce:active:translate-x-0 motion-reduce:active:scale-100
							`}>
								<ArrowLeftIcon className="size-6" aria-hidden="true" />
							</button>
						}
					/>

					<div className="flex items-center justify-between">
						<Logo />
						<ThemeToggle />
					</div>

					{user == null ? (
						<Link href="/sign-in" className={buttonVariants({ variant: 'default' })}>
							Войти
						</Link>
					) : (
						<AccountSummary user={user} />
					)}
				</div>
			</DrawerContent>
		</Drawer>
	)
}
