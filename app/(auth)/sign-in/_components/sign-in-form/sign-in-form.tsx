'use client'

import type { AuthAction } from '#/modules/auth/types'
import type { RoutePath } from '#/seo'

import { getAuthMeQueryKey } from '@repo/api'
import { Button, Spinner } from '@repo/core'
import { useAppForm } from '@repo/core/form'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signInSchema } from '#/modules/auth/schemas'

interface SignInFormProps {
	action: AuthAction
	redirectPath: RoutePath
}

export function SignInForm({ action, redirectPath }: SignInFormProps) {
	const [formError, setFormError] = useState<string | undefined>(undefined)
	const queryClient = useQueryClient()
	const router = useRouter()

	const form = useAppForm({
		defaultValues: { email: '', password: '' },
		validators: { onSubmit: signInSchema },
		onSubmit: async ({ formApi, value }) => {
			setFormError(undefined)

			const result = await action(value)

			if (result.fieldErrors != null) {
				for (const [field, message] of Object.entries(result.fieldErrors)) {
					formApi.setFieldMeta(field as 'email', (meta) => ({
						...meta,
						isTouched: true,
						errorMap: { ...meta.errorMap, onServer: message },
						errors: [message],
					}))
				}
			}

			if (result.formError != null) {
				setFormError(result.formError)
			}

			if (result.ok) {
				await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() })
				router.replace(redirectPath)
			}
		},
	})

	return (
		<form
			className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-card p-6 text-card-foreground"
			noValidate
			onSubmit={(event) => {
				event.preventDefault()
				void form.handleSubmit()
			}}
		>
			<h1 className="text-2xl font-semibold">Вход</h1>

			{formError == null ? null : (
				<p role="alert" className="text-sm text-destructive">
					{formError}
				</p>
			)}

			<form.AppField name="email">
				{(field) => (
					<field.TextField
						label="Email"
						type="email"
						placeholder="you@example.com"
						autoComplete="email"
					/>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.TextField
						label="Пароль"
						type="password"
						placeholder="Ваш пароль"
						autoComplete="current-password"
					/>
				)}
			</form.AppField>

			<form.Subscribe
				selector={(state) => ({
					isSubmitting: state.isSubmitting,
					requiredFieldsFilled:
						state.values.email.trim() !== '' && state.values.password !== '',
				})}
			>
				{({ isSubmitting, requiredFieldsFilled }) => (
					<Button
						type="submit"
						disabled={isSubmitting || !requiredFieldsFilled}
						aria-busy={isSubmitting}
					>
						{isSubmitting ? <Spinner className="size-5" /> : 'Войти'}
					</Button>
				)}
			</form.Subscribe>

			<p className="text-sm text-foreground">
				Нет аккаунта?{' '}
				<Link href="/sign-up" className="underline">
					Зарегистрироваться
				</Link>
			</p>
		</form>
	)
}
