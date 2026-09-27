'use client'

// Deep import instead of the barrel: the barrel also re-exports a server-only component.
import { useCurrentUser } from '#/components/auth-status/use-current-user'
import { useIsHydrated } from '#/hooks/use-is-hydrated'

export function DashboardGreeting() {
	const resolvedCurrentUser = useCurrentUser(null)
	// The layout already warms the same `auth/me` query for the header, so on the client it can
	// resolve to the real user before this component's own SSR-matching render commits — gate on
	// hydration so the first client render still matches the (always logged-out) server render
	// instead of triggering a hydration mismatch.
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
