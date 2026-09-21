import type { GetSkillsQueryResponse } from './codegen'

import { describe, expect, it } from 'vitest'

import { getMockScenarioRoute } from './mock-scenarios'

function getSkills(params?: Record<string, unknown>): GetSkillsQueryResponse {
	const route = getMockScenarioRoute('GET', '/api/skills')

	if (!route) {
		throw new Error('Mock route for GET /api/skills is not registered')
	}

	return route.create({ params }) as GetSkillsQueryResponse
}

describe('mock filtering for GET /api/skills', () => {
	it('returns the full catalog when no params are provided', () => {
		const skills = getSkills()

		expect(skills.length).toBeGreaterThan(1)
	})

	it('filters by case-insensitive title search', () => {
		const skills = getSkills({ search: 'аутентификация' })

		expect(skills.length).toBeGreaterThan(0)
		expect(skills.every((skill) => skill.title.toLowerCase().includes('аутентификация'))).toBe(
			true,
		)
	})

	it('filters by exact topic match', () => {
		const skills = getSkills({ topic: 'Безопасность' })

		expect(skills.length).toBeGreaterThan(0)
		expect(skills.every((skill) => skill.topic === 'Безопасность')).toBe(true)
	})

	it('filters by exact difficulty match', () => {
		const skills = getSkills({ difficulty: 'hard' })

		expect(skills.length).toBeGreaterThan(0)
		expect(skills.every((skill) => skill.difficulty === 'hard')).toBe(true)
	})

	it('filters by questions count range', () => {
		const skills = getSkills({ minQuestionsCount: 20, maxQuestionsCount: 22 })

		expect(skills.length).toBeGreaterThan(0)
		expect(
			skills.every((skill) => skill.questionsCount >= 20 && skill.questionsCount <= 22),
		).toBe(true)
	})

	it('combines multiple filters', () => {
		const skills = getSkills({ topic: 'JavaScript', difficulty: 'easy' })

		expect(skills.length).toBeGreaterThan(0)
		expect(
			skills.every((skill) => skill.topic === 'JavaScript' && skill.difficulty === 'easy'),
		).toBe(true)
	})

	it('returns an empty list when nothing matches', () => {
		const skills = getSkills({ search: 'no such skill exists' })

		expect(skills).toStrictEqual([])
	})
})
