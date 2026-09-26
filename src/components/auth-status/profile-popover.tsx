'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { getAuthMeQueryKey } from '@repo/api'
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@repo/core'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authClient } from '#/lib/auth/client'

interface ProfilePopoverProps {
	triggerLabel?: string
	user: CurrentUser
}

export function ProfilePopover({ triggerLabel, user }: ProfilePopoverProps) {
	const queryClient = useQueryClient()
	const router = useRouter()
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<button
						type="button"
						aria-label={`Профиль: ${user.name}`}
						className={cn(
							'shrink-0 cursor-pointer',
							triggerLabel == null
								? 'size-10 overflow-hidden rounded-full bg-heading/10 border-shaded'
								: 'v-stack items-center gap-1 text-xs',
						)}
					>
						{triggerLabel == null ? (
							<Avatar user={user} />
						) : (
							<>
								<span className="size-6 overflow-hidden rounded-full bg-heading/10 border-shaded">
									<Avatar user={user} />
								</span>
								{triggerLabel}
							</>
						)}
					</button>
				}
			/>

			<PopoverContent align="end" className="w-[300px]">
				<div className="v-stack gap-4">
					<div className="flex items-center gap-3">
						<span className="size-10 shrink-0 overflow-hidden rounded-full bg-heading/10 border-shaded">
							<Avatar user={user} />
						</span>

						<div className="v-stack min-w-0 gap-0.5">
							<span className="truncate text-sm font-medium">{user.name}</span>
							<span className="truncate text-sm text-muted-foreground">
								{user.email}
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							void (async () => {
								await authClient.signOut()
								queryClient.removeQueries({ queryKey: getAuthMeQueryKey() })
								setOpen(false)
								router.refresh()
							})()
						}}
					>
						Выйти
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

function Avatar({ user }: { user: CurrentUser }) {
	if (user.image == null) {
		return (
			<span
				aria-hidden="true"
				className="flex size-full items-center justify-center text-sm font-semibold"
			>
				{user.name.slice(0, 1).toUpperCase()}
			</span>
		)
	}

	return (
		<Image
			src={user.image}
			alt=""
			width={40}
			height={40}
			className="size-full object-cover"
			unoptimized
		/>
	)
}
