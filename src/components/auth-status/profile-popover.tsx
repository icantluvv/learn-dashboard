'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { Button, Popover, PopoverContent, PopoverTrigger } from '@repo/core'
import { useState } from 'react'

import { AccountSummary } from './account-summary'
import { useSignOut } from './use-sign-out'

interface ProfilePopoverProps {
	user: CurrentUser
}

export function ProfilePopover({ user }: ProfilePopoverProps) {
	const [open, setOpen] = useState(false)
	const signOut = useSignOut(() => setOpen(false))

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<button type="button" className="w-full cursor-pointer rounded-xl text-left">
						<AccountSummary user={user} />
					</button>
				}
			/>

			<PopoverContent align="start" className="w-64 bg-gray-ultralight">
				<Button
					variant="outline"
					className="w-full"
					onClick={() => {
						void signOut()
					}}
				>
					Выйти
				</Button>
			</PopoverContent>
		</Popover>
	)
}
