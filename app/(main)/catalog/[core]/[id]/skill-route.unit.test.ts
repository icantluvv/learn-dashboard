import * as allure from 'allure-js-commons'
import { describe, expect, it } from 'vitest'

import { isSkillInCore } from './skill-route'

describe('isSkillInCore', () => {
	it('принимает совпадающее направление', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'Каталог' },
			{ name: 'story', value: 'Навык открыт в своём направлении' },
			{ name: 'severity', value: 'normal' },
		)

		expect(isSkillInCore('frontend', 'frontend')).toBe(true)
	})

	it('отклоняет чужое направление', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'Каталог' },
			{ name: 'story', value: 'Навык открыт под чужим направлением' },
			{ name: 'severity', value: 'critical' },
		)

		expect(isSkillInCore('frontend', 'backend')).toBe(false)
	})

	it('отклоняет неизвестное направление маршрута', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'Каталог' },
			{ name: 'story', value: 'Навык открыт под неизвестным направлением' },
			{ name: 'severity', value: 'normal' },
		)

		expect(isSkillInCore('frontend', null)).toBe(false)
	})
})
