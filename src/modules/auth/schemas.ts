import * as z from 'zod/mini'

import {
	GENDER_VALUES,
	MAX_AGE,
	MIN_AGE,
	MIN_NAME_LENGTH,
	MIN_PASSWORD_LENGTH,
} from '#/lib/auth/constants'

const ageSchema = z
	.number({ error: 'Укажите возраст' })
	.check(
		z.int({ error: 'Возраст должен быть целым числом' }),
		z.minimum(MIN_AGE, { error: `Возраст должен быть не меньше ${MIN_AGE}` }),
		z.maximum(MAX_AGE, { error: `Возраст должен быть не больше ${MAX_AGE}` }),
	)

const imageSchema = z.union([
	z.literal(''),
	z.url({ error: 'Введите корректную ссылку на изображение' }),
])

export const signUpSchema = z.object({
	name: z.string().check(
		z.trim(),
		z.minLength(MIN_NAME_LENGTH, {
			error: `Имя должно содержать минимум ${MIN_NAME_LENGTH} символа`,
		}),
	),
	email: z.email({ error: 'Введите корректный email' }),
	password: z.string().check(
		z.minLength(MIN_PASSWORD_LENGTH, {
			error: `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`,
		}),
	),
	gender: z.enum(GENDER_VALUES, { error: 'Выберите пол' }),
	age: ageSchema,
	image: z.optional(imageSchema),
})

export const signInSchema = z.object({
	email: z.email({ error: 'Введите корректный email' }),
	password: z.string().check(z.minLength(1, { error: 'Введите пароль' })),
})

export const signUpFormSchema = z.extend(signUpSchema, {
	image: imageSchema,
	gender: z
		.nullable(z.enum(GENDER_VALUES))
		.check(z.refine((value) => value != null, { error: 'Выберите пол' })),
	age: z
		.nullable(ageSchema)
		.check(z.refine((value) => value != null, { error: 'Укажите возраст' })),
})
