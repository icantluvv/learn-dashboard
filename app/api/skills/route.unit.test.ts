import type { GetSkills200 } from '@repo/api'

import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkills = vi.fn<(filters?: unknown) => Promise<GetSkills200>>()

vi.mock('#/modules/skills/server/skills-repository', () => ({
	getSkills: async (filters?: unknown) => getSkills(filters),
}))

const { GET } = await import('./route')

describe('get /api/skills', () => {
	beforeEach(() => {
		getSkills.mockReset()
	})

	it('returns the skills list as json', async () => {
		const skills: GetSkills200 = [
			{
				id: 'js-closures',
				title: 'Замыкания',
				questionsCount: 5,
				difficulty: 'medium',
				topic: 'JS',
			},
		]
		getSkills.mockResolvedValue(skills)

		const response = await GET(new NextRequest('http://localhost/api/skills'))

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual(skills)
		expect(getSkills).toHaveBeenCalledWith({
			search: undefined,
			topic: undefined,
			difficulty: undefined,
			minQuestionsCount: undefined,
			maxQuestionsCount: undefined,
		})
	})

	it('parses query params into filters', async () => {
		getSkills.mockResolvedValue([])

		await GET(
			new NextRequest(
				'http://localhost/api/skills?search=Замыкания&topic=JavaScript&difficulty=medium&minQuestionsCount=5&maxQuestionsCount=20',
			),
		)

		expect(getSkills).toHaveBeenCalledWith({
			search: 'Замыкания',
			topic: 'JavaScript',
			difficulty: 'medium',
			minQuestionsCount: 5,
			maxQuestionsCount: 20,
		})
	})

	it('returns an empty array when nothing matches', async () => {
		getSkills.mockResolvedValue([])

		const response = await GET(new NextRequest('http://localhost/api/skills?topic=Unknown'))

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual([])
	})

	it('returns 400 for an invalid difficulty value', async () => {
		const response = await GET(
			new NextRequest('http://localhost/api/skills?difficulty=impossible'),
		)

		expect(response.status).toBe(400)
		expect(getSkills).not.toHaveBeenCalled()
	})
})
