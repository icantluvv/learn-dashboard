import { getAuthMeQueryKey } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getCurrentUser } from '#/lib/auth/get-session'
import { getQueryClient } from '#/utils/get-query-client'

import { ProfileTab } from './profile-tab'

export async function ProfileTabSlot() {
	const user = await getCurrentUser()
	const queryClient = getQueryClient()

	if (user != null) {
		queryClient.setQueryData(getAuthMeQueryKey(), user)
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProfileTab initialUser={user} />
		</HydrationBoundary>
	)
}
