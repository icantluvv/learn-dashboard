import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkillById = vi.fn()

vi.mock('#/modules/skills/server/skills-repository', () => ({ getSkillById }))

const NOT_FOUND = 'NEXT_NOT_FOUND'

vi.mock('next/navigation', () => ({
	notFound: () => {
		throw new Error(NOT_FOUND)
	},
}))

const { generateMetadata } = await import('./page')

const params = (core: string, id: string) => ({ params: Promise.resolve({ core, id }) })

describe('generateMetadata страницы навыка', () => {
	beforeEach(() => {
		getSkillById.mockReset()
	})

	it('строит заголовок и описание из данных навыка', async () => {
		getSkillById.mockResolvedValue({
			title: 'Замыкания',
			core: 'frontend',
			questions: [{ id: '1' }, { id: '2' }],
		})

		const metadata = await generateMetadata(params('frontend', 'skill-1'))

		expect(metadata.title).toBe('Замыкания')
		expect(metadata.description).toContain('Замыкания')
		expect(metadata.description).toContain('2')
		expect(metadata.alternates?.canonical).toBe('/catalog/frontend/skill-1')
	})

	it('возвращает валидные метаданные направления, когда источник данных недоступен', async () => {
		getSkillById.mockRejectedValue(new Error('backend is down'))

		const metadata = await generateMetadata(params('frontend', 'skill-1'))

		expect(metadata.title).not.toHaveLength(0)
		expect(metadata.description).not.toHaveLength(0)
		expect(metadata.robots).toStrictEqual({ index: false, follow: false })
	})

	it('отдаёт 404 для навыка чужого направления', async () => {
		getSkillById.mockResolvedValue({ title: 'Замыкания', core: 'frontend', questions: [] })

		await expect(generateMetadata(params('backend', 'skill-1'))).rejects.toThrow(NOT_FOUND)
	})

	it('отдаёт 404 для несуществующего навыка', async () => {
		getSkillById.mockResolvedValue(null)

		await expect(generateMetadata(params('frontend', 'missing'))).rejects.toThrow(NOT_FOUND)
	})

	it('отдаёт 404 для неизвестного направления, не обращаясь к источнику данных', async () => {
		await expect(generateMetadata(params('unknown', 'skill-1'))).rejects.toThrow(NOT_FOUND)
		expect(getSkillById).not.toHaveBeenCalled()
	})
})
