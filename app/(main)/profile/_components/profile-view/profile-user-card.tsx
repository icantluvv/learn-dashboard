'use client'

import type { CurrentUser } from '#/lib/auth/get-session'
import type { RemoveAvatarAction, UpdateAvatarAction } from '#/modules/auth/types'

import { Button } from '@repo/core'

import { useSignOut } from '#/components/auth-status/use-sign-out'
import { ROLE_LABELS } from '@/(main)/profile/_constants/role-labels'

import { ProfileAvatarUpload } from './profile-avatar-upload'

interface ProfileUserCardProps {
	removeAvatarAction: RemoveAvatarAction
	updateAvatarAction: UpdateAvatarAction
	user: CurrentUser
}

export function ProfileUserCard({
	removeAvatarAction,
	updateAvatarAction,
	user,
}: ProfileUserCardProps) {
	const signOut = useSignOut()
	const fullName = user.lastName == null ? user.name : `${user.name} ${user.lastName}`

	return (
		<div className="overflow-hidden rounded-2xl bg-card border-shaded">
			<div className="h-24 w-full bg-gradient-to-br from-brand-primary to-brand-secondary" />

			<div className="v-stack items-start gap-6 px-6 pb-8">
				<ProfileAvatarUpload
					action={updateAvatarAction}
					removeAction={removeAvatarAction}
					user={user}
				/>

				<div className="v-stack gap-1">
					<span className="text-lg font-medium">{fullName}</span>
					{user.age == null ? null : (
						<span className="text-sm text-muted-foreground">{user.age} лет</span>
					)}
					<span className="text-sm text-muted-foreground">{ROLE_LABELS[user.role]}</span>
					<span className="text-sm text-muted-foreground">{user.email}</span>
				</div>

				<Button
					variant="outline"
					onClick={() => {
						void signOut()
					}}
				>
					Выйти
				</Button>
			</div>
		</div>
	)
}
