import { getAuthMeQueryKey } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getCurrentUser } from '#/lib/auth/get-session'
import { getQueryClient } from '#/utils/get-query-client'
import { ProfileView } from '@/(main)/profile/_components/profile-view'

export default async function ProfilePage() {
	const user = await getCurrentUser()
	const queryClient = getQueryClient()

	if (user != null) {
		queryClient.setQueryData(getAuthMeQueryKey(), user)
	}

	return (
		<div className="page-wrapper flex flex-1 items-center justify-center">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ProfileView />
			</HydrationBoundary>
		</div>
	)
}
