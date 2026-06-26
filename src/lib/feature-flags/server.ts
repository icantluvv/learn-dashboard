import type { Context, IToggle } from '@unleash/nextjs'

import type { FeatureFlagContext } from './context'
import type { FeatureFlagName } from './names'

import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

import {
	createFeatureFlagContext,
	createUnleashSessionId,
	UNLEASH_SESSION_COOKIE_NAME,
} from './context'

import 'server-only'

interface FeatureFlagBootstrap {
	context: FeatureFlagContext
	toggles: IToggle[]
}

async function getCurrentFeatureFlagContext(): Promise<FeatureFlagContext> {
	const cookieStore = await cookies()
	const sessionId =
		cookieStore.get(UNLEASH_SESSION_COOKIE_NAME)?.value ?? createUnleashSessionId()

	return createFeatureFlagContext({ sessionId })
}

async function loadFeatureFlagDefinitions(): ReturnType<typeof getDefinitions> {
	return getDefinitions()
}

const getFeatureFlagDefinitions = cache(loadFeatureFlagDefinitions)

async function getFeatureFlagToggles(context: Context): Promise<IToggle[]> {
	const definitions = await getFeatureFlagDefinitions()
	const { toggles } = evaluateFlags(definitions, context)

	return toggles
}

export async function getFeatureFlagBootstrap(): Promise<FeatureFlagBootstrap> {
	const context = await getCurrentFeatureFlagContext()

	try {
		return {
			context,
			toggles: await getFeatureFlagToggles(context),
		}
	} catch {
		return {
			context,
			toggles: [],
		}
	}
}

export async function isFeatureFlagEnabled(name: FeatureFlagName, context?: Context) {
	try {
		const featureFlagContext = context ?? (await getCurrentFeatureFlagContext())
		const toggles = await getFeatureFlagToggles(featureFlagContext)
		const client = flagsClient(toggles)
		return client.isEnabled(name)
	} catch {
		return false
	}
}
