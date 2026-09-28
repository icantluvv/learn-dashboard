import type { GetCores200 } from '@repo/api'
import type { CoreRow } from '@repo/api/database'

import { getCores200Schema } from '@repo/api'
import { getCoreRows } from '@repo/api/database'
import { cache } from 'react'

import 'server-only'

const CORE_SELECT = 'type,name,description,icon,is_available,display_order'

function toCore(row: CoreRow): GetCores200[number] {
	return {
		type: row.type!,
		name: row.name!,
		description: row.description!,
		icon: row.icon!,
		isAvailable: row.is_available!,
	}
}

export async function getCores(): Promise<GetCores200> {
	const rows = await getCoreRows({
		params: {
			select: CORE_SELECT,
			order: 'display_order.asc',
		},
	})

	return getCores200Schema.parse(rows.map((row) => toCore(row)))
}

/** Обёрнут в `cache()` по той же причине, что и `getSkillById`: см. комментарий там. */
export const getCoreByType = cache(async (type: GetCores200[number]['type']) => {
	const rows = await getCoreRows({
		params: {
			type: `eq.${type}`,
			select: CORE_SELECT,
			limit: 1,
		},
	})
	const row = rows[0]

	if (row == null) {
		return null
	}

	return getCores200Schema.parse([toCore(row)])[0]!
})
