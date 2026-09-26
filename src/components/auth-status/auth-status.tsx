'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { getAuthMeQueryKey, useGetAuthMe } from '@repo/api'
import { Button } from '@repo/core'
import { useQueryClient } from '@tanstack/react-query'
import { LogOutIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { authClient } from '#/lib/auth/client'

import { GuestLinks } from './guest-links'

interface AuthStatusProps {
	initialUser: CurrentUser | null
}

export function AuthStatus({ initialUser }: AuthStatusProps) {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { data, isError, isPending } = useGetAuthMe({ query: { retry: false } })
	const user = isPending ? initialUser : isError ? null : data

	if (user == null) {
		return <GuestLinks />
	}

	return (
		<div className="flex items-center gap-3">
			{user.image == null ? null : (
				<Image
					src={user.image}
					alt=""
					width={32}
					height={32}
					className="size-8 rounded-full object-cover"
					unoptimized
				/>
			)}
			<span className="text-sm font-medium">{user.name}</span>
			<Button
				variant="ghost"
				size="icon-lg"
				aria-label="Выйти"
				title="Выйти"
				onClick={() => {
					void (async () => {
						await authClient.signOut()
						queryClient.removeQueries({ queryKey: getAuthMeQueryKey() })
						router.refresh()
					})()
				}}
			>
				<LogOutIcon />
			</Button>
		</div>
	)
}
