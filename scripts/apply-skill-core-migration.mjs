import { readFile } from 'node:fs/promises'

import { Client } from 'pg'

const connectionString = process.env.SUPABASE_DB_URL

if (!connectionString) {
	throw new Error('SUPABASE_DB_URL is required')
}

const migrationUrl = new URL(
	'../supabase/migrations/20260928140000_add_core_to_skills.sql',
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

	const coresResult = await client.query(`
		select
			count(*)::integer as total,
			array_agg(type order by display_order) as types
		from public.cores
	`)
	const skillsResult = await client.query(`
		select
			count(*)::integer as total,
			count(*) filter (where core = 'frontend')::integer as frontend,
			count(*) filter (where core is null)::integer as missing_core
		from public.skills
	`)
	const constraintResult = await client.query(`
		select exists (
			select 1
			from pg_constraint
			where conrelid = 'public.skills'::regclass
				and conname = 'skills_core_fkey'
		) as exists
	`)

	const cores = coresResult.rows[0]
	const skills = skillsResult.rows[0]
	const expectedTypes = ['frontend', 'backend', 'devops', 'design']

	if (cores?.total !== expectedTypes.length) {
		throw new Error('Catalog core seed verification failed')
	}

	if (JSON.stringify(cores.types) !== JSON.stringify(expectedTypes)) {
		throw new Error('Catalog core order verification failed')
	}

	if (skills?.missing_core !== 0 || skills?.frontend !== skills?.total) {
		throw new Error('Skill core backfill verification failed')
	}

	if (constraintResult.rows[0]?.exists !== true) {
		throw new Error('Skill core foreign key verification failed')
	}

	await client.query("notify pgrst, 'reload schema'")

	process.stdout.write(
		`Catalog core migration is ready: ${cores.total} cores, ${skills.total} frontend skills\n`,
	)
} finally {
	await client.end()
}
