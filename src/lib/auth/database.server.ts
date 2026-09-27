import { Pool } from 'pg'

import { serverEnvironment } from '#/env/server'

import 'server-only'

const globalForPool = globalThis as typeof globalThis & { authDbPool?: Pool }

export function getAuthDbPool() {
	globalForPool.authDbPool ??= new Pool({
		connectionString: serverEnvironment.SUPABASE_DB_URL,
		max: 1,
	})

	return globalForPool.authDbPool
}
