'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { Button, Spinner } from '@repo/core'
import { LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'

import { AccountSummary } from './account-summary'
import { useSignOut } from './use-sign-out'

interface ProfilePopoverProps {
	user: CurrentUser
}

export function ProfilePopover({ user }: ProfilePopoverProps) {
	const signOut = useSignOut()
	const [isSigningOut, startSignOutTransition] = useTransition()

	return (
		<div className="flex items-center justify-between gap-2">
			<AccountSummary user={user} />

			<Button
				variant="ghost"
				size="icon-lg"
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
