'use client'

import type { ReactNode } from 'react'

import type { RemoveAvatarAction, UpdateAvatarAction } from '#/modules/auth/types'
import type { CompletedSkillsCoreGroup } from '#/modules/skills/server/skill-completion-repository.server'

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

interface ProfileViewProps {
	completedSkillGroups?: CompletedSkillsCoreGroup[]
	removeAvatarAction: RemoveAvatarAction
	updateAvatarAction: UpdateAvatarAction
}

const noCompletedSkillGroups: CompletedSkillsCoreGroup[] = []

export function ProfileView({
	completedSkillGroups = noCompletedSkillGroups,
	removeAvatarAction,
	updateAvatarAction,
}: ProfileViewProps) {
	const { data, error, isError, isLoading } = useGetAuthMe({ query: { retry: false } })

	if (isLoading) {
		return (
			<CenteredState>
				<ProfileLoading />
			</CenteredState>
		)
	}

	if (isError) {
		return (
			<CenteredState>
				{isUnauthorizedError(error) ? <ProfileGuest /> : <ProfileError />}
			</CenteredState>
		)
	}

	if (data == null) {
		return (
			<CenteredState>
				<ProfileError />
			</CenteredState>
		)
	}

	return (
		<ProfileAuthenticated
			completedSkillGroups={completedSkillGroups}
			removeAvatarAction={removeAvatarAction}
			updateAvatarAction={updateAvatarAction}
			user={data}
		/>
	)
}

function CenteredState({ children }: { children: ReactNode }) {
	return <div className="flex flex-1 items-center justify-center">{children}</div>
}
