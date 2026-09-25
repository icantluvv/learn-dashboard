import type { SkillRow } from '@repo/api/database'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkillRows = vi.fn<(config: { params?: Record<string, unknown> }) => Promise<SkillRow[]>>()

vi.mock('@repo/api/database', () => ({
	getSkillRows: async (config: { params?: Record<string, unknown> }) => getSkillRows(config),
}))

const { getSkillById, getSkills } = await import('./skills-repository')

function makeRow(overrides: Partial<SkillRow> = {}): SkillRow {
	return {
		id: 'js-closures',
		title: 'Замыкания в JavaScript',
		topic: 'JavaScript',
		difficulty: 'medium',
		questions: ['Что такое замыкание?'],
		questions_count: 1,
		...overrides,
	}
}

describe('skills-repository', () => {
	beforeEach(() => {
		getSkillRows.mockReset()
	})

	describe('getSkills', () => {
		it('requests all rows without filters', async () => {
			getSkillRows.mockResolvedValue([makeRow()])

			const result = await getSkills()

			expect(getSkillRows).toHaveBeenCalledWith({
				params: { select: 'id,title,topic,difficulty,questions_count', order: 'title.asc' },
			})
			expect(result).toStrictEqual([
				{
					id: 'js-closures',
					title: 'Замыкания в JavaScript',
					questionsCount: 1,
					difficulty: 'medium',
					topic: 'JavaScript',
				},
			])
		})

		it('translates search into an ilike filter on title', async () => {
			getSkillRows.mockResolvedValue([])

			await getSkills({ search: 'Замыкания' })

			expect(getSkillRows).toHaveBeenCalledWith({
				params: {
					title: 'ilike.*Замыкания*',
					select: 'id,title,topic,difficulty,questions_count',
					order: 'title.asc',
				},
			})
		})

		it('translates topic and difficulty into eq filters', async () => {
			getSkillRows.mockResolvedValue([])

			await getSkills({ topic: 'JavaScript', difficulty: 'medium' })

			expect(getSkillRows).toHaveBeenCalledWith({
				params: {
					topic: 'eq.JavaScript',
					difficulty: 'eq.medium',
					select: 'id,title,topic,difficulty,questions_count',
					order: 'title.asc',
				},
			})
		})

		it('translates minQuestionsCount and maxQuestionsCount into a questions_count range', async () => {
			getSkillRows.mockResolvedValue([])

			await getSkills({ minQuestionsCount: 5, maxQuestionsCount: 20 })

			expect(getSkillRows).toHaveBeenCalledWith({
				params: {
					questions_count: ['gte.5', 'lte.20'],
					select: 'id,title,topic,difficulty,questions_count',
					order: 'title.asc',
				},
			})
		})

		it('translates only the lower bound when maxQuestionsCount is absent', async () => {
			getSkillRows.mockResolvedValue([])

			await getSkills({ minQuestionsCount: 5 })

			expect(getSkillRows).toHaveBeenCalledWith({
				params: {
					questions_count: ['gte.5'],
					select: 'id,title,topic,difficulty,questions_count',
					order: 'title.asc',
				},
			})
		})

		it('translates only the upper bound when minQuestionsCount is absent', async () => {
			getSkillRows.mockResolvedValue([])

			await getSkills({ maxQuestionsCount: 20 })

			expect(getSkillRows).toHaveBeenCalledWith({
				params: {
					questions_count: ['lte.20'],
					select: 'id,title,topic,difficulty,questions_count',
					order: 'title.asc',
				},
			})
		})

		it('returns an empty array when nothing matches', async () => {
			getSkillRows.mockResolvedValue([])

			const result = await getSkills({ topic: 'Unknown' })

			expect(result).toStrictEqual([])
		})
	})

	describe('getSkillById', () => {
		it('requests a single row filtered by id', async () => {
			getSkillRows.mockResolvedValue([makeRow()])

			await getSkillById('js-closures')

			expect(getSkillRows).toHaveBeenCalledWith({
				params: { id: 'eq.js-closures', select: 'title,questions', limit: 1 },
			})
		})

		it('maps the row to title and questions', async () => {
			getSkillRows.mockResolvedValue([
				makeRow({ title: 'Замыкания в JavaScript', questions: ['Q1', 'Q2'] }),
			])

			const result = await getSkillById('js-closures')

			expect(result).toStrictEqual({
				title: 'Замыкания в JavaScript',
				questions: ['Q1', 'Q2'],
			})
		})

		it('returns null when no row matches', async () => {
			getSkillRows.mockResolvedValue([])

			const result = await getSkillById('missing')

			expect(result).toBeNull()
		})
	})
})
