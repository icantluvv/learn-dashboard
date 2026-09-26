import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod/mini'

export const serverEnvironment = createEnv({
	skipValidation: process.env.CI === 'true',
	emptyStringAsUndefined: true,
	experimental__runtimeEnv: process.env,
	server: {
		BACK_INTERNAL_URL: z.url(),
		MOCK_MODE: z.optional(z.string()),
		BACK_INTERNAL_BASIC_AUTH: z.optional(z.string()),
		SUPABASE_URL: z.url(),
		SUPABASE_SERVICE_ROLE_KEY: z.string(),
		SUPABASE_DB_URL: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url(),
		SENTRY_AUTH_TOKEN: z.optional(z.string()),
		SENTRY_ORG: z.optional(z.string()),
		SENTRY_URL: z.optional(z.url()),
	},
})
