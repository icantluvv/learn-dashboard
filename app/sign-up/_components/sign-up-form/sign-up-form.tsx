'use client'

import type { Gender } from '#/lib/auth/constants'
import type { AuthAction } from '#/modules/auth/types'

import { getAuthMeQueryKey } from '@repo/api'
import { Button } from '@repo/core'
import { useAppForm } from '@repo/core/form'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signUpFormSchema } from '#/modules/auth/schemas'
import { GENDER_OPTIONS } from '@/sign-up/_constants/gender-options'

interface SignUpFormProps {
	action: AuthAction
}

export function SignUpForm({ action }: SignUpFormProps) {
	const [formError, setFormError] = useState<string | undefined>(undefined)
	const queryClient = useQueryClient()
	const router = useRouter()

	const form = useAppForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			gender: null as Gender | null,
			age: null as number | null,
			image: '',
		},
		validators: { onSubmit: signUpFormSchema },
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
				router.replace('/')
			}
		},
	})

	return (
		<form
			className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6"
			noValidate
			onSubmit={(event) => {
				event.preventDefault()
				void form.handleSubmit()
			}}
		>
			<h1 className="text-2xl font-semibold">Регистрация</h1>

			{formError == null ? null : (
				<p role="alert" className="text-sm text-destructive">
					{formError}
				</p>
			)}

			<form.AppField name="name">
				{(field) => <field.TextField label="Имя" autoComplete="name" />}
			</form.AppField>

			<form.AppField name="email">
				{(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.TextField label="Пароль" type="password" autoComplete="new-password" />
				)}
			</form.AppField>

			<form.AppField name="gender">
				{(field) => (
					<field.SelectField
						label="Пол"
						placeholder="Выберите пол"
						options={GENDER_OPTIONS}
					/>
				)}
			</form.AppField>

			<form.AppField name="age">
				{(field) => <field.NumberField label="Возраст" min={1} max={120} />}
			</form.AppField>

			<form.AppField name="image">
				{(field) => <field.TextField label="Ссылка на аватар (необязательно)" type="url" />}
			</form.AppField>

			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
						{isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
					</Button>
				)}
			</form.Subscribe>

			<p className="text-sm text-gray-600">
				Уже есть аккаунт?{' '}
				<Link href="/sign-in" className="underline">
					Войти
				</Link>
			</p>
		</form>
	)
}
