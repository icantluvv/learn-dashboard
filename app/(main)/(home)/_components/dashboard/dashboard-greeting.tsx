'use client'

import { useCurrentUser } from '#/components/auth-status/use-current-user'
import { useIsHydrated } from '#/hooks/use-is-hydrated'

export function DashboardGreeting() {
	const resolvedCurrentUser = useCurrentUser(null)
	const isHydrated = useIsHydrated()
	const currentUser = isHydrated ? resolvedCurrentUser : null
	const greeting =
		currentUser != null && currentUser.name !== ''
			? `С возвращением, ${currentUser.name}`
			: 'Добро пожаловать'

	return (
		<section className="v-stack gap-2">
			<h1 className="text-3xl font-semibold">{greeting}</h1>
			<p className="text-base text-muted-foreground">К чему приступим сегодня?</p>
		</section>
	)
}
