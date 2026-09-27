'use client'

import { useGetAuthMe } from '@repo/api'

import { ProfileAuthenticated } from './profile-authenticated'
import { ProfileError } from './profile-error'
import { ProfileGuest } from './profile-guest'
import { ProfileLoading } from './profile-loading'

function isUnauthorizedError(error: unknown): boolean {
	if (!(error instanceof Error) || typeof error.cause !== 'object' || error.cause == null) {
		return false
	}

	return 'status' in error.cause && error.cause.status === 401
}

export function ProfileView() {
	const { data, error, isError, isLoading } = useGetAuthMe({ query: { retry: false } })

	if (isLoading) {
		return <ProfileLoading />
	}

	if (isError) {
		return isUnauthorizedError(error) ? <ProfileGuest /> : <ProfileError />
	}

	if (data == null) {
		return <ProfileError />
	}

	return <ProfileAuthenticated user={data} />
}
