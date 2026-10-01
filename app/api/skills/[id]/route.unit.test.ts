import type { GetSkillById200 } from '@repo/api'

import type { CurrentUser } from '#/lib/auth/get-session'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkillById = vi.fn<(id: string) => Promise<GetSkillById200 | null>>()
const getCurrentUser = vi.fn<() => Promise<CurrentUser | null>>()
const isSkillCompleted = vi.fn<(userId: string, skillId: string) => Promise<boolean>>()

vi.mock('#/modules/skills/server/skills-repository', () => ({
	getSkillById: async (id: string) => getSkillById(id),
}))

vi.mock('#/lib/auth/get-session', () => ({
	getCurrentUser: async () => getCurrentUser(),
}))

vi.mock('#/modules/skills/server/skill-completion-repository.server', () => ({
	isSkillCompleted: async (userId: string, skillId: string) => isSkillCompleted(userId, skillId),
}))

const { GET } = await import('./route')

const skill: GetSkillById200 = {
	title: 'Замыкания',
	questions: ['Q1', 'Q2'],
	core: 'frontend',
}

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
	completedSkillsCount: 3,
}

async function get(id = 'js-closures') {
	const response = await GET(new Request(`http://localhost/api/skills/${id}`), {
		params: Promise.resolve({ id }),
	})

	return response
}

describe('get /api/skills/[id]', () => {
	beforeEach(() => {
		getSkillById.mockReset()
		getCurrentUser.mockReset()
		isSkillCompleted.mockReset()
		getSkillById.mockResolvedValue(skill)
		getCurrentUser.mockResolvedValue(null)
		isSkillCompleted.mockResolvedValue(false)
	})

	it('returns the skill as json for an anonymous request', async () => {
		const response = await get()

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual(skill)
		expect(getSkillById).toHaveBeenCalledWith('js-closures')
	})

	it('omits the completion mark for an anonymous request', async () => {
		const response = await get()

		await expect(response.json()).resolves.not.toHaveProperty('completed')
		expect(isSkillCompleted).not.toHaveBeenCalled()
	})

	it('adds completed: true for an authenticated request on a completed skill', async () => {
		getCurrentUser.mockResolvedValue(user)
		isSkillCompleted.mockResolvedValue(true)

		const response = await get()

		await expect(response.json()).resolves.toStrictEqual({ ...skill, completed: true })
		expect(isSkillCompleted).toHaveBeenCalledWith('user-1', 'js-closures')
	})

	it('adds completed: false for an authenticated request on a skill without a mark', async () => {
		getCurrentUser.mockResolvedValue(user)

		const response = await get()

		await expect(response.json()).resolves.toStrictEqual({ ...skill, completed: false })
	})

	it('does not cache the response, because it depends on the user', async () => {
		const response = await get()

		expect(response.headers.get('Cache-Control')).toBe('no-store')
	})

	it('returns 404 when the skill does not exist', async () => {
		getSkillById.mockResolvedValue(null)

		const response = await get('missing')

		expect(response.status).toBe(404)
		expect(isSkillCompleted).not.toHaveBeenCalled()
	})
})
