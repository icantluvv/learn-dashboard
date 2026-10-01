'use client'

import { useGetDashboardStats } from '@repo/api'

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
