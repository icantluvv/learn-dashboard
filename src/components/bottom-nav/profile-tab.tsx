'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { UserIcon } from 'lucide-react'
import Link from 'next/link'

import { ProfilePopover } from '#/components/auth-status/profile-popover'
import { useCurrentUser } from '#/components/auth-status/use-current-user'

interface ProfileTabProps {
	initialUser: CurrentUser | null
}

export function ProfileTab({ initialUser }: ProfileTabProps) {
	const user = useCurrentUser(initialUser)

	if (user == null) {
		return (
			<Link
				href="/sign-in"
				className="v-stack items-center gap-1.5 text-xs text-muted-foreground"
			>
				<UserIcon className="size-7" aria-hidden="true" />
				Войти
			</Link>
		)
	}

	return <ProfilePopover user={user} triggerLabel="Профиль" />
}
