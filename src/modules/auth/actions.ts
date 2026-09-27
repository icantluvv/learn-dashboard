'use server'

import type { ValidatedAvatar } from './avatar'
import type { AuthActionResult } from './types'

import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'

import { serverEnvironment } from '#/env/server'
import { auth } from '#/lib/auth/server'

import { validateAvatarFile } from './avatar'
import { deleteUserAfterAvatarFailure, saveAvatar } from './avatar-repository.server'
import { signInSchema, signUpSchema } from './schemas'

const genericErrorMessage = 'Не удалось выполнить запрос. Попробуйте ещё раз'
const invalidCredentialsMessage = 'Неверный email или пароль'

function toFieldErrors(issues: { message: string; path: PropertyKey[] }[]) {
	const fieldErrors: Record<string, string> = {}

	for (const issue of issues) {
		const [field] = issue.path

		if (typeof field === 'string' && fieldErrors[field] == null) {
			fieldErrors[field] = issue.message
		}
	}

	return fieldErrors
}

function getSignUpValues(formData: FormData) {
	return {
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
		gender: formData.get('gender'),
		age: Number(formData.get('age')),
	}
}

async function resolveAvatar(formData: FormData) {
	const avatarEntry = formData.get('avatar')
	const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : undefined

	if (avatarFile == null) {
		return undefined
	}

	return validateAvatarFile(avatarFile)
}

async function persistAvatar(avatar: ValidatedAvatar & { id: string }, userId: string) {
	try {
		await saveAvatar({
			id: avatar.id,
			userId,
			contentType: avatar.contentType,
			byteLength: avatar.bytes.byteLength,
			bytes: avatar.bytes,
		})

		return true
	} catch {
		await deleteUserAfterAvatarFailure(userId)

		return false
	}
}

export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
	const parsed = signUpSchema.safeParse(getSignUpValues(formData))

	if (!parsed.success) {
		return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) }
	}

	const avatar = await resolveAvatar(formData)

	if (typeof avatar === 'string') {
		return { ok: false, fieldErrors: { avatar } }
	}

	const { age, email, gender, name, password } = parsed.data
	const storedAvatar = avatar == null ? undefined : { ...avatar, id: crypto.randomUUID() }
	const avatarUrl =
		storedAvatar == null
			? undefined
			: new URL(
					`/api/avatars/${storedAvatar.id}`,
					serverEnvironment.BETTER_AUTH_URL,
				).toString()

	try {
		const result = await auth.api.signUpEmail({
			headers: await headers(),
			body: {
				name,
				email,
				password,
				gender,
				age,
				...(avatarUrl == null ? {} : { image: avatarUrl }),
			},
		})

		if (storedAvatar != null && !(await persistAvatar(storedAvatar, result.user.id))) {
			return { ok: false, formError: genericErrorMessage }
		}
	} catch (error) {
		if (error instanceof APIError) {
			if (error.body?.code === 'USER_ALREADY_EXISTS') {
				return { ok: false, fieldErrors: { email: 'Этот email уже используется' } }
			}

			return { ok: false, formError: error.body?.message ?? genericErrorMessage }
		}

		return { ok: false, formError: genericErrorMessage }
	}

	return { ok: true }
}

export async function signInAction(values: unknown): Promise<AuthActionResult> {
	const parsed = signInSchema.safeParse(values)

	if (!parsed.success) {
		return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) }
	}

	try {
		await auth.api.signInEmail({
			headers: await headers(),
			body: parsed.data,
		})
	} catch (error) {
		if (error instanceof APIError) {
			return { ok: false, formError: invalidCredentialsMessage }
		}

		return { ok: false, formError: genericErrorMessage }
	}

	return { ok: true }
}
