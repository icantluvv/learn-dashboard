'use client'

import type { IToggle } from '@unleash/nextjs'
import type { ReactNode } from 'react'

import type { FeatureFlagContext } from '#/lib/feature-flags/context'

import { FlagProvider } from '@unleash/nextjs/client'

import { clientEnvironment } from '#/env/client'

interface FeatureFlagsProviderProps {
	children: ReactNode
	context: FeatureFlagContext
	toggles: IToggle[]
}

function getClientConfig() {
	if (
		clientEnvironment.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL == null ||
		clientEnvironment.NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN == null
	) {
		return null
	}

	return {
		url: clientEnvironment.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL,
		clientKey: clientEnvironment.NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN,
		appName: clientEnvironment.NEXT_PUBLIC_UNLEASH_APP_NAME,
	}
}

export function FeatureFlagsProvider({ children, context, toggles }: FeatureFlagsProviderProps) {
	const clientConfig = getClientConfig()

	return (
		<FlagProvider
			startClient={clientConfig != null}
			config={{
				...(clientConfig ?? {}),
				bootstrap: toggles,
				bootstrapOverride: true,
				context,
				disableRefresh: true,
			}}
		>
			{children}
		</FlagProvider>
	)
}
