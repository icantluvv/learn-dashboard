import * as allure from 'allure-js-commons'
import { describe, expect, it } from 'vitest'

import { getMockScenarioRoute } from './mock-scenarios'

describe('mock response for GET /api/cores', () => {
	it('returns catalog core metadata', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'mock catalog core API response' },
			{ name: 'severity', value: 'normal' },
		)
		const route = getMockScenarioRoute('GET', '/api/cores')

		if (route == null) {
			throw new Error('Mock route for GET /api/cores is not registered')
		}

		expect(route.create()).toStrictEqual([
			expect.objectContaining({
				type: 'frontend',
				name: 'Frontend',
				icon: 'code',
				isAvailable: true,
			}),
			expect.objectContaining({ type: 'backend', isAvailable: false }),
			expect.objectContaining({ type: 'devops', isAvailable: false }),
			expect.objectContaining({ type: 'design', isAvailable: false }),
		])
	})
})
