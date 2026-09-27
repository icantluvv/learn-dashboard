'use client'

import type { SignUpGender } from '#/lib/auth/constants'
import type { SignUpAction } from '#/modules/auth/types'

import { getAuthMeQueryKey } from '@repo/api'
import { Button, Spinner } from '@repo/core'
import { useAppForm } from '@repo/core/form'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signUpFormSchema } from '#/modules/auth/schemas'
import { AvatarDropzone } from '@/(auth)/sign-up/_components/avatar-dropzone'
import { GENDER_OPTIONS } from '@/(auth)/sign-up/_constants/gender-options'

interface SignUpFormProps {
	action: SignUpAction
}

export function SignUpForm({ action }: SignUpFormProps) {
	const [formError, setFormError] = useState<string | undefined>(undefined)
	const [avatarError, setAvatarError] = useState<string | undefined>(undefined)
	const queryClient = useQueryClient()
	const router = useRouter()

	const form = useAppForm({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			gender: null as SignUpGender | null,
			age: null as number | null,
			avatar: null as File | null,
		},
		validators: { onSubmit: signUpFormSchema },
		onSubmit: async ({ formApi, value }) => {
			setFormError(undefined)

			if (avatarError != null) {
				return
			}

			const formData = new FormData()
			formData.set('name', value.name)
			formData.set('email', value.email)
			formData.set('password', value.password)
			formData.set('gender', value.gender ?? '')
			formData.set('age', value.age == null ? '' : String(value.age))

			if (value.avatar != null) {
				formData.set('avatar', value.avatar)
			}

			const result = await action(formData)

			if (result.fieldErrors != null) {
				for (const [field, message] of Object.entries(result.fieldErrors)) {
					if (field === 'avatar') {
						setAvatarError(message)
						continue
					}

					formApi.setFieldMeta(
						field as 'age' | 'email' | 'gender' | 'name' | 'password',
						(meta) => ({
							...meta,
							isTouched: true,
							errorMap: { ...meta.errorMap, onServer: message },
							errors: [message],
						}),
					)
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
			className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-card p-6 text-card-foreground"
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

			<form.AppField name="avatar">
				{(field) => (
					<AvatarDropzone
						value={field.state.value}
						error={avatarError}
						onChange={field.handleChange}
						onError={setAvatarError}
					/>
				)}
			</form.AppField>

			<form.AppField name="name">
				{(field) => (
					<field.TextField
						label="Имя"
						placeholder="Как вас зовут"
						autoComplete="name"
						required
					/>
				)}
			</form.AppField>

			<form.AppField name="email">
				{(field) => (
					<field.TextField
						label="Email"
						type="email"
						placeholder="you@example.com"
						autoComplete="email"
						required
					/>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.TextField
						label="Пароль"
						type="password"
						placeholder="Минимум 8 символов"
						autoComplete="new-password"
						required
					/>
				)}
			</form.AppField>

			<form.AppField name="gender">
				{(field) => (
					<field.SelectField
						label="Пол"
						placeholder="Выберите пол"
						options={GENDER_OPTIONS}
						required
					/>
				)}
			</form.AppField>

			<form.AppField name="age">
				{(field) => (
					<field.NumberField
						label="Возраст"
						placeholder="Например, 25"
						min={1}
						max={120}
						required
					/>
				)}
			</form.AppField>

			<form.Subscribe
				selector={(state) => ({
					isSubmitting: state.isSubmitting,
					requiredFieldsFilled:
						state.values.name.trim() !== '' &&
						state.values.email.trim() !== '' &&
						state.values.password !== '' &&
						state.values.gender != null &&
						state.values.age != null,
				})}
			>
				{({ isSubmitting, requiredFieldsFilled }) => (
					<Button
						type="submit"
						disabled={isSubmitting || !requiredFieldsFilled || avatarError != null}
						aria-busy={isSubmitting}
					>
						{isSubmitting ? <Spinner className="size-5" /> : 'Зарегистрироваться'}
					</Button>
				)}
			</form.Subscribe>

			<p className="text-sm text-foreground">
				Уже есть аккаунт?{' '}
				<Link href="/sign-in" className="underline">
					Войти
				</Link>
			</p>
		</form>
	)
}
