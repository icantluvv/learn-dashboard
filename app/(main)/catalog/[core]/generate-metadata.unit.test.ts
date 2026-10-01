import { describe, expect, it, vi } from 'vitest'

import { SKILL_CORES } from '#/constants/skill-cores'

const getCoreByType = vi.fn()

vi.mock('#/modules/cores/server/cores-repository', () => ({ getCoreByType }))

const NOT_FOUND = 'NEXT_NOT_FOUND'

vi.mock('next/navigation', () => ({
	notFound: () => {
		throw new Error(NOT_FOUND)
	},
}))

const { generateMetadata } = await import('./page')

const params = (core: string) => ({ params: Promise.resolve({ core }) })

describe('generateMetadata страницы направления', () => {
	it('называет направление в заголовке и описании', async () => {
		const metadata = await generateMetadata(params('frontend'))

		expect(metadata.title).toContain('Frontend')
		expect(metadata.description).not.toHaveLength(0)
		expect(metadata.alternates?.canonical).toBe('/catalog/frontend')
	})

	it('даёт каждому направлению собственные метаданные', async () => {
		const titles = await Promise.all(
			SKILL_CORES.map(async (core) => {
				const metadata = await generateMetadata(params(core))

				return metadata.title
			}),
		)

		expect(new Set(titles).size).toBe(SKILL_CORES.length)
	})

	it('не обращается к источнику данных направления ради метаданных', async () => {
		await generateMetadata(params('frontend'))

		expect(getCoreByType).not.toHaveBeenCalled()
	})

	it('отдаёт 404 для неизвестного направления', async () => {
		await expect(generateMetadata(params('unknown'))).rejects.toThrow(NOT_FOUND)
	})
})
