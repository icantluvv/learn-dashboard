'use client'

import type { CurrentUser } from '#/lib/auth/get-session'
import type { UpdateAvatarAction } from '#/modules/auth/types'
import type { CompletedSkillsCoreGroup } from '#/modules/skills/server/skill-completion-repository.server'

import { Button } from '@repo/core'

import { useSignOut } from '#/components/auth-status/use-sign-out'

import { ProfileAvatarUpload } from './profile-avatar-upload'

const ROLE_LABELS = {
	developer: 'Разработчик',
	analyst: 'Аналитик',
	student: 'Студент',
	beginner: 'Начинающий',
} as const

interface ProfileAuthenticatedProps {
	completedSkillGroups: CompletedSkillsCoreGroup[]
	updateAvatarAction: UpdateAvatarAction
	user: CurrentUser
}

export function ProfileAuthenticated({
	completedSkillGroups,
	updateAvatarAction,
	user,
}: ProfileAuthenticatedProps) {
	const signOut = useSignOut()
	const fullName = user.lastName == null ? user.name : `${user.name} ${user.lastName}`

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-2xl bg-card border-shaded">
				<div className="h-24 w-full bg-gradient-to-br from-brand-primary to-brand-secondary" />

				<div className="v-stack items-start gap-6 px-6 pb-8">
					<div className="relative z-10 -mt-10">
						<ProfileAvatarUpload action={updateAvatarAction} user={user} />
					</div>

					<div className="v-stack gap-1">
						<span className="text-lg font-medium">{fullName}</span>
						{user.age == null ? null : (
							<span className="text-sm text-muted-foreground">{user.age} лет</span>
						)}
						<span className="text-sm text-muted-foreground">
							{ROLE_LABELS[user.role]}
						</span>
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

			<CompletedSkillsSection groups={completedSkillGroups} />
		</div>
	)
}

function CompletedSkillsSection({ groups }: { groups: CompletedSkillsCoreGroup[] }) {
	return (
		<section className="mt-6 v-stack gap-4 rounded-2xl bg-card p-6 border-shaded">
			<h2 className="text-base font-medium">Изученные навыки</h2>

			{groups.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Вы ещё не отметили ни одного навыка изученным
				</p>
			) : (
				<div className="v-stack gap-4">
					{groups.map((group) => (
						<div key={group.core} className="v-stack gap-2">
							<span className="text-sm font-medium text-muted-foreground">
								{group.coreName}
							</span>
							<div className="flex flex-wrap gap-2">
								{group.skills.map((skill) => (
									<span
										key={skill.id}
										className="rounded-full px-3 py-1 text-sm border-shaded"
									>
										{skill.title}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	)
}
