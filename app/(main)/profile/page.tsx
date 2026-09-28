import { getAuthMeQueryKey } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getCurrentUser } from '#/lib/auth/get-session'
import { buildPageMetadata } from '#/seo'
import { getQueryClient } from '#/utils/get-query-client'
import { ProfileView } from '@/(main)/profile/_components/profile-view'

export const metadata = buildPageMetadata({
	title: 'Профиль',
	description: 'Личные данные аккаунта и настройки профиля.',
	path: '/profile',
	noIndex: true,
})

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
