'use client'

import type { RemoveAvatarAction, UpdateAvatarAction } from '#/modules/auth/types'

import { useGetAuthMe } from '@repo/api'

import { CompletedSkillsContent } from './completed-skills-content'
import { ProfileUserCard } from './profile-user-card'

interface ProfileAuthenticatedProps {
	removeAvatarAction: RemoveAvatarAction
	updateAvatarAction: UpdateAvatarAction
}

export function ProfileAuthenticated({
	removeAvatarAction,
	updateAvatarAction,
}: ProfileAuthenticatedProps) {
	const { data: user } = useGetAuthMe()

	if (user == null) {
		return null
	}

	return (
		<div className="w-full">
			<ProfileUserCard
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
				user={user}
			/>

			<section className="mt-6 v-stack gap-4 rounded-2xl bg-card p-6 border-shaded">
				<h2 className="text-base font-medium">Изученные навыки</h2>

				<CompletedSkillsContent />
			</section>
		</div>
	)
}
