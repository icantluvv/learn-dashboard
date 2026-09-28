import * as allure from 'allure-js-commons'
import { describe, expect, it } from 'vitest'

import { resolveSkillCore, SKILL_CORES } from './skill-cores'

describe('resolveSkillCore', () => {
	it.each(SKILL_CORES)('возвращает направление для сегмента %s', async (core) => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'resolve known catalog core segment' },
			{ name: 'severity', value: 'critical' },
		)

		expect(resolveSkillCore(core)).toBe(core)
	})

	it('возвращает null для неизвестного сегмента', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'reject unknown catalog core segment' },
			{ name: 'severity', value: 'critical' },
		)

		expect(resolveSkillCore('mobile')).toBeNull()
	})

	it('возвращает null для пустого сегмента', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-cores' },
			{ name: 'story', value: 'reject empty catalog core segment' },
			{ name: 'severity', value: 'normal' },
		)

		expect(resolveSkillCore('')).toBeNull()
	})
})
