'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { getAuthMeQueryKey } from '@repo/api'
import { Button } from '@repo/core'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getAvatarDisplayUrl } from '#/lib/auth/avatar-url'
import { authClient } from '#/lib/auth/client'

interface ProfileAuthenticatedProps {
	user: CurrentUser
}

export function ProfileAuthenticated({ user }: ProfileAuthenticatedProps) {
	const queryClient = useQueryClient()
	const router = useRouter()

	return (
		<div className="v-stack items-center gap-6 text-center">
			<span className="size-20 shrink-0 overflow-hidden rounded-full bg-heading/10 border-shaded">
				<Avatar user={user} />
			</span>

			<div className="v-stack gap-0.5">
				<span className="text-lg font-medium">{user.name}</span>
				<span className="text-sm text-muted-foreground">{user.email}</span>
			</div>

			<Button
				variant="outline"
				onClick={() => {
					void (async () => {
						await authClient.signOut()
						queryClient.removeQueries({ queryKey: getAuthMeQueryKey() })
						router.refresh()
					})()
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
