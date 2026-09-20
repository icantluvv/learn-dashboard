'use client'

import { createContext, use } from 'react'

const SsrWidthContext = createContext<number | null>(null)
SsrWidthContext.displayName = 'SsrWidthContext'

export function useSsrWidth(): number | undefined {
	const ssrWidth = use(SsrWidthContext)
	return typeof ssrWidth === 'number' ? ssrWidth : undefined
}

export const SsrWidthProvider = SsrWidthContext.Provider
