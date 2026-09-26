import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'

import { isDev } from '#/constants/env'
import { serverEnvironment } from '#/env/server'

import { GENDER_VALUES } from './constants'

import 'server-only'

const globalForPool = globalThis as typeof globalThis & { authDbPool?: Pool }

function getPool() {
	globalForPool.authDbPool ??= new Pool({
		connectionString: serverEnvironment.SUPABASE_DB_URL,
		max: 1,
	})

	return globalForPool.authDbPool
}

export const auth = betterAuth({
	database: getPool(),
	secret: serverEnvironment.BETTER_AUTH_SECRET,
	baseURL: serverEnvironment.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
	},
	user: {
		additionalFields: {
			gender: { type: [...GENDER_VALUES], required: true, input: true },
			age: { type: 'number', required: true, input: true },
		},
	},
	advanced: {
		defaultCookieAttributes: {
			httpOnly: true,
			sameSite: 'lax',
			secure: !isDev,
			path: '/',
		},
	},
	plugins: [nextCookies()],
})
