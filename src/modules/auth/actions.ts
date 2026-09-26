'use server'

import type { AuthActionResult } from './types'

import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'

import { auth } from '#/lib/auth/server'

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

export async function signUpAction(values: unknown): Promise<AuthActionResult> {
	const parsed = signUpSchema.safeParse(values)

	if (!parsed.success) {
		return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) }
	}

	const { age, email, gender, image, name, password } = parsed.data

	try {
		await auth.api.signUpEmail({
			headers: await headers(),
			body: {
				name,
				email,
				password,
				gender,
				age,
				...(image == null || image === '' ? {} : { image }),
			},
		})
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
