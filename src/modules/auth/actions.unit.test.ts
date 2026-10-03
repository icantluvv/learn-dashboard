import { APIError } from 'better-auth/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

interface AuthApiCall {
	body: Record<string, unknown>
	headers: Headers
}

const signUpEmail = vi.fn<(options: AuthApiCall) => Promise<unknown>>()
const signInEmail = vi.fn<(options: AuthApiCall) => Promise<unknown>>()
const saveAvatar = vi.fn<(input: unknown) => Promise<void>>()
const deleteUserAfterAvatarFailure = vi.fn<(userId: string) => Promise<void>>()
vi.mock('#/lib/auth/server', () => ({
	auth: {
		api: {
			signUpEmail: async (options: AuthApiCall) => signUpEmail(options),
			signInEmail: async (options: AuthApiCall) => signInEmail(options),
		},
	},
}))

vi.mock('./avatar-repository.server', () => ({
	saveAvatar: async (input: unknown) => saveAvatar(input),
	deleteUserAfterAvatarFailure: async (userId: string) => deleteUserAfterAvatarFailure(userId),
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
	role: 'developer',
}

function signUpFormData(values: Record<string, number | string> = validSignUp) {
	const formData = new FormData()

	for (const [key, value] of Object.entries(values)) {
		formData.set(key, String(value))
	}

	return formData
}

function apiError(code: string, status = 422) {
	return new APIError(status as never, { code, message: 'api error' })
}

describe('signUpAction', () => {
	beforeEach(() => {
		signUpEmail.mockReset()
		saveAvatar.mockReset()
		deleteUserAfterAvatarFailure.mockReset()
	})

	it('reports success so the form can refresh the profile and navigate', async () => {
		signUpEmail.mockResolvedValue({ user: { id: 'user-1' } })

		await expect(signUpAction(signUpFormData())).resolves.toStrictEqual({ ok: true })
	})

	it('stores the avatar and passes its same-origin URL to Better Auth', async () => {
		signUpEmail.mockResolvedValue({ user: { id: 'user-1' } })
		const formData = signUpFormData()
		formData.set(
			'avatar',
			new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'a.png', {
				type: 'image/png',
			}),
		)

		await signUpAction(formData)
		expect(signUpEmail.mock.calls[0]?.[0]?.body).toMatchObject({
			image: expect.stringMatching(
				/^http:\/\/localhost:3000\/api\/avatars\/[0-9a-f-]+$/,
			) as string,
		})
		expect(saveAvatar).toHaveBeenCalledWith(
			expect.objectContaining({ userId: 'user-1', contentType: 'image/png', byteLength: 8 }),
		)
	})

	it('omits the avatar when it is empty', async () => {
		signUpEmail.mockResolvedValue({ user: { id: 'user-1' } })

		await signUpAction(signUpFormData())
		expect(signUpEmail.mock.calls[0]?.[0]?.body).not.toHaveProperty('image')
		expect(saveAvatar).not.toHaveBeenCalled()
	})

	it('omits lastName and age when they are not provided', async () => {
		signUpEmail.mockResolvedValue({ user: { id: 'user-1' } })
		const { age, ...rest } = validSignUp
		void age

		await signUpAction(signUpFormData(rest))
		expect(signUpEmail.mock.calls[0]?.[0]?.body).not.toHaveProperty('age')
		expect(signUpEmail.mock.calls[0]?.[0]?.body).not.toHaveProperty('lastName')
	})

	it('passes lastName and role to Better Auth', async () => {
		signUpEmail.mockResolvedValue({ user: { id: 'user-1' } })

		await signUpAction(signUpFormData({ ...validSignUp, lastName: 'Пантелеев' }))
		expect(signUpEmail.mock.calls[0]?.[0]?.body).toMatchObject({
			lastName: 'Пантелеев',
			role: 'developer',
		})
	})

	it('rejects invalid input without calling Better Auth', async () => {
		const result = await signUpAction(
			signUpFormData({ ...validSignUp, name: 'Ан', password: '123' }),
		)

		expect(signUpEmail).not.toHaveBeenCalled()
		expect(result.fieldErrors).toHaveProperty('name')
		expect(result.fieldErrors).toHaveProperty('password')
	})

	it('rejects a request that skips the client form entirely', async () => {
		const result = await signUpAction(signUpFormData({ email: 'user@example.com' }))

		expect(signUpEmail).not.toHaveBeenCalled()
		expect(Object.keys(result.fieldErrors ?? {}).length).toBeGreaterThan(0)
	})

	it('maps a taken email to the email field', async () => {
		signUpEmail.mockRejectedValue(apiError('USER_ALREADY_EXISTS'))

		const result = await signUpAction(signUpFormData())

		expect(result.fieldErrors?.email).toContain('email')
		expect(result.ok).toBe(false)
	})

	it('rejects a spoofed image before creating a user', async () => {
		const formData = signUpFormData()
		formData.set('avatar', new File(['not an image'], 'a.png', { type: 'image/png' }))

		const result = await signUpAction(formData)

		expect(result.fieldErrors?.avatar).toContain('Содержимое')
		expect(signUpEmail).not.toHaveBeenCalled()
	})

	it('deletes a newly created user when avatar storage fails', async () => {
		signUpEmail.mockResolvedValue({ user: { id: 'user-1' } })
		saveAvatar.mockRejectedValue(new Error('database unavailable'))
		const formData = signUpFormData()
		formData.set(
			'avatar',
			new File([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], 'a.jpg', { type: 'image/jpeg' }),
		)

		const result = await signUpAction(formData)

		expect(deleteUserAfterAvatarFailure).toHaveBeenCalledWith('user-1')
		expect(result).toMatchObject({ ok: false, formError: expect.any(String) as string })
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
