'use client'

import { getAuthMeQueryKey } from '@repo/api'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { authClient } from '#/lib/auth/client'

export function useSignOut(onSignedOut?: () => void) {
	const queryClient = useQueryClient()
	const router = useRouter()

	return async function signOut() {
		await authClient.signOut()
		queryClient.removeQueries({ queryKey: getAuthMeQueryKey() })
		onSignedOut?.()
		router.refresh()
	}
}
