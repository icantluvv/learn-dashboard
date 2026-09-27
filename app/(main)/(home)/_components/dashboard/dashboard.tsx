'use client'

import { useGetDashboardStats } from '@repo/api'

// Deep import instead of the barrel: the barrel also re-exports a server-only component.
import { useCurrentUser } from '#/components/auth-status/use-current-user'
import { useIsHydrated } from '#/hooks/use-is-hydrated'

import { DashboardEmpty } from './dashboard-empty'
import { DashboardError } from './dashboard-error'
import { DashboardGreeting } from './dashboard-greeting'
import { DashboardSkeleton } from './dashboard-skeleton'
import { DashboardStats } from './dashboard-stats'

export function Dashboard() {
	const { data: stats, isError, isLoading } = useGetDashboardStats()
	const resolvedCurrentUser = useCurrentUser(null)
	// Same hydration gate as `DashboardGreeting` — the progress bar's presence must match between
	// server and first client render too, not just the greeting text.
	const isHydrated = useIsHydrated()
	const isAuthenticated = isHydrated && resolvedCurrentUser != null

	return (
		<div className="v-stack gap-8">
			<DashboardGreeting />

			{isLoading ? (
				<DashboardSkeleton />
			) : isError ? (
				<DashboardError />
			) : !stats || stats.skillsCount === 0 ? (
				<DashboardEmpty />
			) : (
				<DashboardStats stats={stats} isAuthenticated={isAuthenticated} />
			)}
		</div>
	)
}
