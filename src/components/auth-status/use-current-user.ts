'use client'

import type { CurrentUser } from '#/lib/auth/get-session'

import { useGetAuthMe } from '@repo/api'

export function useCurrentUser(initialUser: CurrentUser | null): CurrentUser | null {
	const { data, isError, isPending } = useGetAuthMe({ query: { retry: false } })

	return isPending ? initialUser : isError ? null : data
}
