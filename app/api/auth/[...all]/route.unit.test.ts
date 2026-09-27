import { describe, expect, it, vi } from 'vitest'

const betterAuthPost = vi.fn(async () => Response.json({ ok: true }))

vi.mock('better-auth/next-js', () => ({
	toNextJsHandler: () => ({
		GET: vi.fn(),
		POST: betterAuthPost,
	}),
}))

vi.mock('#/lib/auth/server', () => ({ auth: {} }))

const { POST } = await import('./route')

describe('post /api/auth/[...all]', () => {
	it('blocks the public Better Auth sign-up endpoint', async () => {
		const response = await POST(
			new Request('http://localhost/api/auth/sign-up/email', { method: 'POST' }),
		)

		expect(response.status).toBe(404)
		expect(betterAuthPost).not.toHaveBeenCalled()
	})

	it('keeps other Better Auth POST endpoints available', async () => {
		const request = new Request('http://localhost/api/auth/sign-in/email', { method: 'POST' })

		const response = await POST(request)

		expect(response.status).toBe(200)
		expect(betterAuthPost).toHaveBeenCalledWith(request)
	})
})
