'use client'

import type { ReactNode } from 'react'

import { setOnUnauthorized } from '@repo/api/base/client-handlers'
import { useEffect } from 'react'

import { authClient } from '#/lib/auth/client'

export function AuthProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		setOnUnauthorized(async () => {
			await authClient.getSession()
		})
	}, [])

	return <>{children}</>
}
