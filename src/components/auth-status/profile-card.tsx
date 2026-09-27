'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { Button, Spinner } from '@repo/core'
import { LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'

import { AccountSummary } from './account-summary'
import { useSignOut } from './use-sign-out'

interface ProfileCardProps {
	user: CurrentUser
}

export function ProfileCard({ user }: ProfileCardProps) {
	const signOut = useSignOut()
	const [isSigningOut, startSignOutTransition] = useTransition()

	return (
		<div className="flex items-center justify-between gap-2">
			<AccountSummary user={user} className="min-w-0" />

			<Button
				variant="ghost"
				size="icon-lg"
				className="shrink-0"
				aria-label="Выйти"
				disabled={isSigningOut}
				onClick={() => {
					startSignOutTransition(async () => {
						await signOut()
					})
				}}
			>
				{isSigningOut ? <Spinner className="size-5" /> : <LogOutIcon className="size-5" />}
			</Button>
		</div>
	)
}
