import type { CoreRow } from '@repo/api/database'

import * as allure from 'allure-js-commons'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getCoreRows = vi.fn<(config: { params?: Record<string, unknown> }) => Promise<CoreRow[]>>()

vi.mock('@repo/api/database', () => ({
	getCoreRows: async (config: { params?: Record<string, unknown> }) => getCoreRows(config),
}))

const { getCoreByType, getCores } = await import('./cores-repository')

function makeRow(overrides: Partial<CoreRow> = {}): CoreRow {
	return {
		type: 'frontend',
		name: 'Frontend',
		description: 'Вёрстка, JavaScript, фреймворки и браузерная платформа',
		icon: 'code',
		is_available: true,
		display_order: 0,
		...overrides,
	}
}

describe('cores-repository', () => {
	beforeEach(() => {
		getCoreRows.mockReset()
	})

	it('returns mapped cores in display order', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'list catalog cores' },
			{ name: 'severity', value: 'critical' },
		)
		getCoreRows.mockResolvedValue([makeRow()])

		const result = await getCores()

		expect(getCoreRows).toHaveBeenCalledWith({
			params: {
				select: 'type,name,description,icon,is_available,display_order',
				order: 'display_order.asc',
			},
		})
		expect(result).toStrictEqual([
			{
				type: 'frontend',
				name: 'Frontend',
				description: 'Вёрстка, JavaScript, фреймворки и браузерная платформа',
				icon: 'code',
				isAvailable: true,
			},
		])
	})

	it('returns an empty list when the cores table is empty', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'empty catalog core list' },
			{ name: 'severity', value: 'normal' },
		)
		getCoreRows.mockResolvedValue([])

		await expect(getCores()).resolves.toStrictEqual([])
	})

	it('returns one core filtered by type', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'resolve catalog core by type' },
			{ name: 'severity', value: 'critical' },
		)
		getCoreRows.mockResolvedValue([makeRow()])

		const result = await getCoreByType('frontend')

		expect(getCoreRows).toHaveBeenCalledWith({
			params: {
				type: 'eq.frontend',
				select: 'type,name,description,icon,is_available,display_order',
				limit: 1,
			},
		})
		expect(result?.type).toBe('frontend')
	})

	it('returns null when a core does not exist', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'missing catalog core' },
			{ name: 'severity', value: 'normal' },
		)
		getCoreRows.mockResolvedValue([])

		await expect(getCoreByType('frontend')).resolves.toBeNull()
	})
})
