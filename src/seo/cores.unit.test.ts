import { describe, expect, it } from 'vitest'

import { SKILL_CORES } from '#/constants/skill-cores'
import { CORE_SEO_COPY, getCoreSeoCopy } from '#/seo/cores'

describe('sEO-реестр направлений', () => {
	it('покрывает каждое направление из реестра приложения', () => {
		expect(Object.keys(CORE_SEO_COPY).sort()).toStrictEqual([...SKILL_CORES].sort())
	})

	it('задаёт непустые заголовок и описание для каждого направления', () => {
		for (const core of SKILL_CORES) {
			const { description, title } = getCoreSeoCopy(core)

			expect(title.length).toBeGreaterThan(0)
			expect(description.length).toBeGreaterThan(0)
		}
	})

	it('даёт разным направлениям разные заголовки и описания', () => {
		const titles = SKILL_CORES.map((core) => getCoreSeoCopy(core).title)
		const descriptions = SKILL_CORES.map((core) => getCoreSeoCopy(core).description)

		expect(new Set(titles).size).toBe(SKILL_CORES.length)
		expect(new Set(descriptions).size).toBe(SKILL_CORES.length)
	})
})
