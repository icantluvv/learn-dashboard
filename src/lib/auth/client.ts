import type { auth } from './server'

import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { clientEnvironment } from '#/env/client'

export const authClient = createAuthClient({
	baseURL: clientEnvironment.NEXT_PUBLIC_BETTER_AUTH_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
})
