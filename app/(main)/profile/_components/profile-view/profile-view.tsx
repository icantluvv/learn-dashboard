'use client'

import type { ReactNode } from 'react'

import type { RemoveAvatarAction, UpdateAvatarAction } from '#/modules/auth/types'

import { useGetAuthMe } from '@repo/api'

import { ProfileAuthenticated } from './profile-authenticated'
import { ProfileError } from './profile-error'
import { ProfileLoading } from './profile-loading'

interface ProfileViewProps {
	removeAvatarAction: RemoveAvatarAction
	updateAvatarAction: UpdateAvatarAction
}

export function ProfileView({ removeAvatarAction, updateAvatarAction }: ProfileViewProps) {
	const { data, isError, isLoading } = useGetAuthMe()

	if (isLoading) {
		return (
			<CenteredState>
				<ProfileLoading />
			</CenteredState>
		)
	}

	if (isError || data == null) {
		return (
			<CenteredState>
				<ProfileError />
			</CenteredState>
		)
	}

	return (
		<ProfileAuthenticated
			removeAvatarAction={removeAvatarAction}
			updateAvatarAction={updateAvatarAction}
		/>
	)
}

function CenteredState({ children }: { children: ReactNode }) {
	return <div className="flex flex-1 items-center justify-center">{children}</div>
}
