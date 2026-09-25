import type { GetSkillByIdQueryResponse, GetSkillsQueryResponse } from './codegen'

import { describe, expect, it } from 'vitest'

import { getMockScenarioRoute } from './mock-scenarios'

function getSkills(params?: Record<string, unknown>): GetSkillsQueryResponse {
	const route = getMockScenarioRoute('GET', '/api/skills')

	if (!route) {
		throw new Error('Mock route for GET /api/skills is not registered')
	}

	return route.create({ params }) as GetSkillsQueryResponse
}

function getSkillById(id: string): GetSkillByIdQueryResponse {
	const url = `/api/skills/${id}`
	const route = getMockScenarioRoute('GET', url)

	if (!route) {
		throw new Error(`Mock route for GET ${url} is not registered`)
	}

	return route.create({ url }) as GetSkillByIdQueryResponse
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

describe('mock detail for GET /api/skills/:id', () => {
	it('returns title and numbered questions for an existing skill id', () => {
		const skill = getSkillById('skill-01')

		expect(skill.title).toBe('Авторизация и аутентификация')
		expect(skill.questions).toHaveLength(14)
		expect(skill.questions[0]).toBe('Вопрос 1 по теме «Авторизация и аутентификация»')
		expect(skill.questions[13]).toBe('Вопрос 14 по теме «Авторизация и аутентификация»')
	})

	it('throws a 404-shaped error for an unknown skill id', () => {
		let caughtError: unknown

		try {
			getSkillById('does-not-exist')
		} catch (error) {
			caughtError = error
		}

		expect(caughtError).toBeInstanceOf(Error)
		expect((caughtError as Error).cause).toStrictEqual({ status: 404, statusText: 'Not Found' })
	})
})
