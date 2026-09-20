'use client'

import mediaQuery from 'css-mediaquery'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { isDefined } from '#/lib/is'

import { useSsrWidth } from './use-ssr-width'

export interface UseMediaQueryOptions {
	defaultMatches?: boolean
	matchMedia?: typeof globalThis.matchMedia
}

export function useMediaQuery(queryInput: string, options: UseMediaQueryOptions = {}): boolean {
	const ssrWidth = useSsrWidth()
	const supportMatchMedia = isDefined(globalThis.window) && isDefined(globalThis.matchMedia)

	const {
		defaultMatches = false,
		matchMedia = supportMatchMedia ? globalThis.matchMedia : null,
	} = options

	const query = queryInput.replace(/^@media( ?)/m, '')

	const getDefaultSnapshot = useCallback(() => defaultMatches, [defaultMatches])

	const getServerSnapshot = useMemo(() => {
		if (typeof ssrWidth === 'number') {
			return () => mediaQuery.match(query, { width: ssrWidth })
		}

		return getDefaultSnapshot
	}, [getDefaultSnapshot, query, ssrWidth])

	const [getSnapshot, subscribe] = useMemo(() => {
		if (matchMedia === null) {
			return [getDefaultSnapshot, () => () => {}]
		}

		const mediaQueryList = matchMedia(query)

		return [
			() => mediaQueryList.matches,
			(notify: () => void) => {
				mediaQueryList.addEventListener('change', notify)

				return () => {
					mediaQueryList.removeEventListener('change', notify)
				}
			},
		]
	}, [getDefaultSnapshot, matchMedia, query])

	const match = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

	return match
}
