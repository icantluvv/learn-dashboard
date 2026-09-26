import type { CurrentUser } from '#/lib/auth/get-session'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const getCurrentUser = vi.fn<() => Promise<CurrentUser | null>>()

vi.mock('#/lib/auth/get-session', () => ({
	getCurrentUser: async () => getCurrentUser(),
}))

const { GET } = await import('./route')

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
}

describe('get /api/me', () => {
	beforeEach(() => {
		getCurrentUser.mockReset()
	})

	it('returns the profile of the authenticated user', async () => {
		getCurrentUser.mockResolvedValue(user)

		const response = await GET()

		expect(response.status).toBe(200)
		await expect(response.json()).resolves.toStrictEqual(user)
	})

	it('returns the avatar when the user has one', async () => {
		getCurrentUser.mockResolvedValue({ ...user, image: 'https://example.com/a.png' })

		const response = await GET()

		await expect(response.json()).resolves.toMatchObject({
			image: 'https://example.com/a.png',
		})
	})

	it('returns 401 for a guest', async () => {
		getCurrentUser.mockResolvedValue(null)

		const response = await GET()

		expect(response.status).toBe(401)
		await expect(response.json()).resolves.not.toHaveProperty('email')
	})

	it('never exposes the password or the session token', async () => {
		const leakyUser: CurrentUser & Record<string, unknown> = {
			...user,
			password: 'hash',
			token: 'session-token',
		}
		getCurrentUser.mockResolvedValue(leakyUser)

		const response = await GET()
		const body: unknown = await response.json()

		expect(body).not.toHaveProperty('password')
		expect(body).not.toHaveProperty('token')
	})

	it('is not cacheable', async () => {
		getCurrentUser.mockResolvedValue(user)

		const response = await GET()

		expect(response.headers.get('cache-control')).toBe('no-store')
	})
})
