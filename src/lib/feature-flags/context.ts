import type { Context } from '@unleash/nextjs'

import { nanoid } from 'nanoid'

export const UNLEASH_SESSION_COOKIE_NAME = 'unleash-session-id'

export interface FeatureFlagContext {
	[key: string]: Context[string]
	sessionId: NonNullable<Context['sessionId']>
	userId?: NonNullable<Context['userId']>
}

interface FeatureFlagContextInput {
	sessionId: string
	userId?: string
}

export function createUnleashSessionId() {
	return nanoid()
}

export function createFeatureFlagContext({
	sessionId,
	userId,
}: FeatureFlagContextInput): FeatureFlagContext {
	return {
		sessionId,
		...(userId == null ? {} : { userId }),
	}
}
