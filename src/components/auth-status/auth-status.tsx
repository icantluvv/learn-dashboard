'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { GuestLinks } from './guest-links'
import { ProfilePopover } from './profile-popover'
import { useCurrentUser } from './use-current-user'

interface AuthStatusProps {
	initialUser: CurrentUser | null
}

export function AuthStatus({ initialUser }: AuthStatusProps) {
	const user = useCurrentUser(initialUser)

	if (user == null) {
		return <GuestLinks />
	}

	return <ProfilePopover user={user} />
}
