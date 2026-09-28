import type { GetSkills200 } from '@repo/api'

import { describe, expect, it } from 'vitest'

import { computeCatalogStats } from './compute-catalog-stats'

function skill(overrides: Partial<GetSkills200[number]> = {}): GetSkills200[number] {
	return {
		id: 'id',
		title: 'Навык',
		topic: 'React',
		difficulty: 'easy',
		questionsCount: 10,
		core: 'frontend',
		...overrides,
	}
}

describe('computeCatalogStats', () => {
	it('возвращает нули для пустого списка', () => {
		expect(computeCatalogStats([])).toStrictEqual({
			byDifficulty: { easy: 0, medium: 0, hard: 0 },
			questionsCount: 0,
			skillsCount: 0,
			topicsCount: 0,
		})
	})

	it('считает один навык', () => {
		expect(computeCatalogStats([skill({ questionsCount: 7 })])).toStrictEqual({
			byDifficulty: { easy: 1, medium: 0, hard: 0 },
			questionsCount: 7,
			skillsCount: 1,
			topicsCount: 1,
		})
	})

	it('считает темы без повторов и суммирует вопросы', () => {
		const stats = computeCatalogStats([
			skill({ id: '1', topic: 'React', questionsCount: 10 }),
			skill({ id: '2', topic: 'React', questionsCount: 5 }),
			skill({ id: '3', topic: 'TypeScript', questionsCount: 25 }),
		])

		expect(stats.skillsCount).toBe(3)
		expect(stats.topicsCount).toBe(2)
		expect(stats.questionsCount).toBe(40)
	})

	it('возвращает 0 для уровня сложности без навыков', () => {
		const stats = computeCatalogStats([
			skill({ id: '1', difficulty: 'easy' }),
			skill({ id: '2', difficulty: 'hard' }),
		])

		expect(stats.byDifficulty).toStrictEqual({ easy: 1, medium: 0, hard: 1 })
	})
})
