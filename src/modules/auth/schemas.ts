import * as z from 'zod/mini'

import {
	MAX_AGE,
	MIN_AGE,
	MIN_NAME_LENGTH,
	MIN_PASSWORD_LENGTH,
	ROLE_VALUES,
	SIGN_UP_GENDER_VALUES,
} from '#/lib/auth/constants'

const ageSchema = z
	.number({ error: 'Укажите возраст' })
	.check(
		z.int({ error: 'Возраст должен быть целым числом' }),
		z.minimum(MIN_AGE, { error: `Возраст должен быть не меньше ${MIN_AGE}` }),
		z.maximum(MAX_AGE, { error: `Возраст должен быть не больше ${MAX_AGE}` }),
	)

const lastNameSchema = z.string().check(
	z.trim(),
	z.minLength(MIN_NAME_LENGTH, {
		error: `Фамилия должна содержать минимум ${MIN_NAME_LENGTH} символа`,
	}),
)

export const signUpSchema = z.object({
	name: z.string().check(
		z.trim(),
		z.minLength(MIN_NAME_LENGTH, {
			error: `Имя должно содержать минимум ${MIN_NAME_LENGTH} символа`,
		}),
	),
	lastName: z.optional(lastNameSchema),
	email: z.email({ error: 'Введите корректный email' }),
	password: z.string().check(
		z.minLength(MIN_PASSWORD_LENGTH, {
			error: `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`,
		}),
	),
	gender: z.enum(SIGN_UP_GENDER_VALUES, { error: 'Выберите пол' }),
	age: z.optional(ageSchema),
	role: z.enum(ROLE_VALUES, { error: 'Выберите роль' }),
})

export const signInSchema = z.object({
	email: z.email({ error: 'Введите корректный email' }),
	password: z.string().check(z.minLength(1, { error: 'Введите пароль' })),
})

export const signUpFormSchema = z.extend(signUpSchema, {
	avatar: z.nullable(
		z.custom<File>((value) => value instanceof File, { error: 'Выберите корректный файл' }),
	),
	lastName: z.string().check(
		z.trim(),
		z.refine((value) => value.length === 0 || value.length >= MIN_NAME_LENGTH, {
			error: `Фамилия должна содержать минимум ${MIN_NAME_LENGTH} символа`,
		}),
	),
	gender: z
		.nullable(z.enum(SIGN_UP_GENDER_VALUES))
		.check(z.refine((value) => value != null, { error: 'Выберите пол' })),
	age: z.nullable(ageSchema),
	role: z
		.nullable(z.enum(ROLE_VALUES))
		.check(z.refine((value) => value != null, { error: 'Выберите роль' })),
})
