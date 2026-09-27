'use client'

import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

/**
 * `true` on every client render except the very first one, which must still match the server render
 * to avoid a hydration mismatch.
 */
export function useIsHydrated(): boolean {
	return useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false,
	)
}
