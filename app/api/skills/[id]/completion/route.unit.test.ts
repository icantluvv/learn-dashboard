import type { CurrentUser } from '#/lib/auth/get-session'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const getCurrentUser = vi.fn<() => Promise<CurrentUser | null>>()
const setSkillCompletion =
	vi.fn<
		(
			userId: string,
			skillId: string,
			completed: boolean,
		) => Promise<{ completedSkillsCount: number } | null>
	>()

vi.mock('#/lib/auth/get-session', () => ({
	getCurrentUser: async () => getCurrentUser(),
}))

vi.mock('#/modules/skills/server/skill-completion-repository.server', () => ({
	setSkillCompletion: async (userId: string, skillId: string, completed: boolean) =>
		setSkillCompletion(userId, skillId, completed),
}))

const { PUT } = await import('./route')

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
	completedSkillsCount: 3,
}

function request(body: unknown, { raw = false }: { raw?: boolean } = {}) {
	return new Request('http://localhost/api/skills/js-closures/completion', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: raw ? (body as string) : JSON.stringify(body),
	})
}

const params = { params: Promise.resolve({ id: 'js-closures' }) }

describe('put /api/skills/[id]/completion', () => {
	beforeEach(() => {
		getCurrentUser.mockReset()
		setSkillCompletion.mockReset()
		getCurrentUser.mockResolvedValue(user)
		setSkillCompletion.mockResolvedValue({ completedSkillsCount: 4 })
	})

	it('marks the skill as completed and returns the new counter', async () => {
		const response = await PUT(request({ completed: true }), params)

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual({
			completed: true,
			completedSkillsCount: 4,
		})
		expect(setSkillCompletion).toHaveBeenCalledWith('user-1', 'js-closures', true)
	})

	it('removes the mark and returns the new counter', async () => {
		setSkillCompletion.mockResolvedValue({ completedSkillsCount: 2 })

		const response = await PUT(request({ completed: false }), params)

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual({
			completed: false,
			completedSkillsCount: 2,
		})
		expect(setSkillCompletion).toHaveBeenCalledWith('user-1', 'js-closures', false)
	})

	it('does not cache the response', async () => {
		const response = await PUT(request({ completed: true }), params)

		expect(response.headers.get('Cache-Control')).toBe('no-store')
	})

	it('returns 401 without a session and does not touch the mark', async () => {
		getCurrentUser.mockResolvedValue(null)

		const response = await PUT(request({ completed: true }), params)

		expect(response.status).toBe(401)
		expect(setSkillCompletion).not.toHaveBeenCalled()
	})

	it('returns 404 when the skill does not exist', async () => {
		setSkillCompletion.mockResolvedValue(null)

		const response = await PUT(request({ completed: true }), params)

		expect(response.status).toBe(404)
	})

	it.each([
		[{}, 'missing field'],
		[{ completed: 'true' }, 'non-boolean field'],
		[{ completed: 1 }, 'numeric field'],
		[[], 'array body'],
		[null, 'null body'],
	])('returns 400 for an invalid body (%#: %s)', async (body, _description) => {
		const response = await PUT(request(body), params)

		expect(response.status).toBe(400)
		expect(setSkillCompletion).not.toHaveBeenCalled()
	})

	it('returns 400 for a body that is not json', async () => {
		const response = await PUT(request('not json', { raw: true }), params)

		expect(response.status).toBe(400)
		expect(setSkillCompletion).not.toHaveBeenCalled()
	})

	it('takes the user from the session and ignores a user id in the body', async () => {
		await PUT(request({ completed: true, userId: 'someone-else' }), params)

		expect(setSkillCompletion).toHaveBeenCalledWith('user-1', 'js-closures', true)
	})
})
