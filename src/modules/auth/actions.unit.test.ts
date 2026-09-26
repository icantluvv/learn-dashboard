import { APIError } from 'better-auth/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

interface AuthApiCall {
	body: Record<string, unknown>
	headers: Headers
}

const signUpEmail = vi.fn<(options: AuthApiCall) => Promise<unknown>>()
const signInEmail = vi.fn<(options: AuthApiCall) => Promise<unknown>>()
vi.mock('#/lib/auth/server', () => ({
	auth: {
		api: {
			signUpEmail: async (options: AuthApiCall) => signUpEmail(options),
			signInEmail: async (options: AuthApiCall) => signInEmail(options),
		},
	},
}))

vi.mock('next/headers', () => ({
	headers: async () => new Headers(),
}))

const { signInAction, signUpAction } = await import('./actions')

const validSignUp = {
	name: 'Сергей',
	email: 'user@example.com',
	password: '12345678',
	gender: 'male',
	age: 28,
}

function apiError(code: string, status = 422) {
	return new APIError(status as never, { code, message: 'api error' })
}

describe('signUpAction', () => {
	beforeEach(() => {
		signUpEmail.mockReset()
	})

	it('reports success so the form can refresh the profile and navigate', async () => {
		signUpEmail.mockResolvedValue({})

		await expect(signUpAction(validSignUp)).resolves.toStrictEqual({ ok: true })
	})

	it('passes the avatar through when it is filled in', async () => {
		signUpEmail.mockResolvedValue({})

		await signUpAction({ ...validSignUp, image: 'https://example.com/a.png' })
		expect(signUpEmail.mock.calls[0]?.[0]?.body).toMatchObject({
			image: 'https://example.com/a.png',
		})
	})

	it('omits the avatar when it is empty', async () => {
		signUpEmail.mockResolvedValue({})

		await signUpAction({ ...validSignUp, image: '' })
		expect(signUpEmail.mock.calls[0]?.[0]?.body).not.toHaveProperty('image')
	})

	it('rejects invalid input without calling Better Auth', async () => {
		const result = await signUpAction({ ...validSignUp, name: 'Ан', password: '123' })

		expect(signUpEmail).not.toHaveBeenCalled()
		expect(result.fieldErrors).toHaveProperty('name')
		expect(result.fieldErrors).toHaveProperty('password')
	})

	it('rejects a request that skips the client form entirely', async () => {
		const result = await signUpAction({ email: 'user@example.com' })

		expect(signUpEmail).not.toHaveBeenCalled()
		expect(Object.keys(result.fieldErrors ?? {}).length).toBeGreaterThan(0)
	})

	it('maps a taken email to the email field', async () => {
		signUpEmail.mockRejectedValue(apiError('USER_ALREADY_EXISTS'))

		const result = await signUpAction(validSignUp)

		expect(result.fieldErrors?.email).toContain('email')
		expect(result.ok).toBe(false)
	})
})

describe('signInAction', () => {
	beforeEach(() => {
		signInEmail.mockReset()
	})

	it('reports success so the form can refresh the profile and navigate', async () => {
		signInEmail.mockResolvedValue({})

		await expect(
			signInAction({ email: 'user@example.com', password: '12345678' }),
		).resolves.toStrictEqual({ ok: true })
	})

	it('reports the same message for a wrong password and an unknown email', async () => {
		signInEmail.mockRejectedValue(apiError('INVALID_EMAIL_OR_PASSWORD', 401))

		const wrongPassword = await signInAction({
			email: 'user@example.com',
			password: 'wrong-password',
		})
		const unknownEmail = await signInAction({
			email: 'nobody@example.com',
			password: '12345678',
		})

		expect(wrongPassword.formError).toBe(unknownEmail.formError)
		expect(wrongPassword.formError).toBeDefined()
	})

	it('rejects invalid input without calling Better Auth', async () => {
		const result = await signInAction({ email: 'nope', password: '' })

		expect(signInEmail).not.toHaveBeenCalled()
		expect(result.fieldErrors).toHaveProperty('email')
		expect(result.fieldErrors).toHaveProperty('password')
	})
})
