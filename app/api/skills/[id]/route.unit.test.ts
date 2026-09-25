import type { GetSkillById200 } from '@repo/api'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkillById = vi.fn<(id: string) => Promise<GetSkillById200 | null>>()

vi.mock('#/modules/skills/server/skills-repository', () => ({
	getSkillById: async (id: string) => getSkillById(id),
}))

const { GET } = await import('./route')

describe('get /api/skills/[id]', () => {
	beforeEach(() => {
		getSkillById.mockReset()
	})

	it('returns the skill as json', async () => {
		const skill: GetSkillById200 = { title: 'Замыкания', questions: ['Q1', 'Q2'] }
		getSkillById.mockResolvedValue(skill)

		const response = await GET(new Request('http://localhost/api/skills/js-closures'), {
			params: Promise.resolve({ id: 'js-closures' }),
		})

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual(skill)
		expect(getSkillById).toHaveBeenCalledWith('js-closures')
	})

	it('returns 404 when the skill does not exist', async () => {
		getSkillById.mockResolvedValue(null)

		const response = await GET(new Request('http://localhost/api/skills/missing'), {
			params: Promise.resolve({ id: 'missing' }),
		})

		expect(response.status).toBe(404)
	})
})
