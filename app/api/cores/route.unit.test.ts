import type { GetCores200 } from '@repo/api'

import * as allure from 'allure-js-commons'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getCores = vi.fn<() => Promise<GetCores200>>()

vi.mock('#/modules/cores/server/cores-repository', () => ({
	getCores: async () => getCores(),
}))

const { GET } = await import('./route')

describe('get /api/cores', () => {
	beforeEach(() => {
		getCores.mockReset()
	})

	it('returns the catalog core list as json', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'catalog core API response' },
			{ name: 'severity', value: 'critical' },
		)
		const cores: GetCores200 = [
			{
				type: 'frontend',
				name: 'Frontend',
				description: 'Frontend description',
				icon: 'code',
				isAvailable: true,
			},
		]
		getCores.mockResolvedValue(cores)

		const response = await GET()

		expect(response.status).toBe(200)
		expect(response.headers.get('Cache-Control')).toBe('no-store')
		await expect(response.json()).resolves.toStrictEqual(cores)
	})
})
