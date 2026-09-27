'use client'

import { useGetDashboardStats } from '@repo/api'
import { useSyncExternalStore } from 'react'

// Deep import instead of the barrel: the barrel also re-exports a server-only component.
import { useCurrentUser } from '#/components/auth-status/use-current-user'

import { DashboardEmpty } from './dashboard-empty'
import { DashboardError } from './dashboard-error'
import { DashboardSkeleton } from './dashboard-skeleton'
import { DashboardStats } from './dashboard-stats'

const noopSubscribe = () => () => {}

// Same value on every client render except the very first one (which must match SSR).
function useIsHydrated() {
	return useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false,
	)
}

export function Dashboard() {
	const { data: stats, isError, isLoading } = useGetDashboardStats()
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
		<div className="v-stack gap-8">
			<section className="v-stack gap-2">
				<h1 className="text-3xl font-semibold">{greeting}</h1>
				<p className="text-base text-muted-foreground">К чему приступим сегодня?</p>
			</section>

			{isLoading ? (
				<DashboardSkeleton />
			) : isError ? (
				<DashboardError />
			) : !stats || stats.skillsCount === 0 ? (
				<DashboardEmpty />
			) : (
				<DashboardStats stats={stats} isAuthenticated={currentUser != null} />
			)}
		</div>
	)
}
