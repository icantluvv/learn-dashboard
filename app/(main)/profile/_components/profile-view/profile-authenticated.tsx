'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { Button } from '@repo/core'
import Image from 'next/image'

import { useSignOut } from '#/components/auth-status/use-sign-out'
import { getAvatarDisplayUrl } from '#/lib/auth/avatar-url'

const ROLE_LABELS = {
	developer: 'Разработчик',
	analyst: 'Аналитик',
	student: 'Студент',
	beginner: 'Начинающий',
} as const

interface ProfileAuthenticatedProps {
	user: CurrentUser
}

export function ProfileAuthenticated({ user }: ProfileAuthenticatedProps) {
	const signOut = useSignOut()
	const fullName = user.lastName == null ? user.name : `${user.name} ${user.lastName}`

	return (
		<div className="v-stack items-center gap-6 text-center">
			<span className="size-20 shrink-0 overflow-hidden rounded-full bg-heading/10 border-shaded">
				<Avatar user={user} />
			</span>

			<div className="v-stack gap-0.5">
				<span className="text-lg font-medium">{fullName}</span>
				<span className="text-sm text-muted-foreground">{user.email}</span>
				<span className="text-sm text-muted-foreground">{ROLE_LABELS[user.role]}</span>
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
	)
}

function Avatar({ user }: { user: CurrentUser }) {
	if (user.image == null) {
		return (
			<span
				aria-hidden="true"
				className="flex size-full items-center justify-center text-lg font-semibold"
			>
				{user.name.slice(0, 1).toUpperCase()}
			</span>
		)
	}

	return (
		<Image
			src={getAvatarDisplayUrl(user.image)}
			alt=""
			width={80}
			height={80}
			className="size-full object-cover"
			unoptimized
		/>
	)
}
