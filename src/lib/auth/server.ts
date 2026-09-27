import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'

import { isDev } from '#/constants/env'
import { serverEnvironment } from '#/env/server'

import { GENDER_VALUES } from './constants'
import { getAuthDbPool } from './database.server'

import 'server-only'

export const auth = betterAuth({
	database: getAuthDbPool(),
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
			completedSkillsCount: {
				type: 'number',
				required: false,
				input: false,
				defaultValue: 0,
			},
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
