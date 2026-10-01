import { readFile } from 'node:fs/promises'

import { Client } from 'pg'

const connectionString = process.env.SUPABASE_DB_URL

if (!connectionString) {
	throw new Error('SUPABASE_DB_URL is required')
}

const migrationUrl = new URL(
	'../supabase/migrations/20261001120000_create_user_completed_skill_table.sql',
	import.meta.url,
)
const migrationSql = await readFile(migrationUrl, 'utf8')
const client = new Client({ connectionString })

await client.connect()

try {
	await client.query('begin')

	try {
		await client.query(migrationSql)
		await client.query('commit')
	} catch (error) {
		await client.query('rollback')
		throw error
	}

	const primaryKeyResult = await client.query(`
		select array_agg(a.attname::text order by a.attname) as columns
		from pg_index i
		join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any (i.indkey)
		where i.indrelid = 'public.user_completed_skill'::regclass
			and i.indisprimary
	`)
	const foreignKeyResult = await client.query(`
		select count(*)::integer as total
		from pg_constraint
		where conrelid = 'public.user_completed_skill'::regclass
			and contype = 'f'
	`)
	const rowLevelSecurityResult = await client.query(`
		select relrowsecurity as enabled
		from pg_class
		where oid = 'public.user_completed_skill'::regclass
	`)

	const primaryKeyColumns = primaryKeyResult.rows[0]?.columns

	if (JSON.stringify(primaryKeyColumns) !== JSON.stringify(['skill_id', 'user_id'])) {
		throw new Error('Completed skill primary key verification failed')
	}

	if (foreignKeyResult.rows[0]?.total !== 2) {
		throw new Error('Completed skill foreign key verification failed')
	}

	if (rowLevelSecurityResult.rows[0]?.enabled !== true) {
		throw new Error('Completed skill row level security verification failed')
	}

	await client.query("notify pgrst, 'reload schema'")

	process.stdout.write('Completed skill table is ready\n')
} finally {
	await client.end()
}
