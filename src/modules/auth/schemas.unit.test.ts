import { describe, expect, it } from 'vitest'

import { signInSchema, signUpSchema } from './schemas'

const validSignUp = {
	name: 'Сергей',
	email: 'user@example.com',
	password: '12345678',
	gender: 'male',
	age: 28,
	role: 'developer',
}

function firstMessageFor(values: unknown, field: string) {
	const result = signUpSchema.safeParse(values)

	expect(result.success).toBe(false)

	return result.error?.issues.find((issue) => issue.path[0] === field)?.message
}

describe('signUpSchema', () => {
	it('accepts the required fields without an avatar', () => {
		expect(signUpSchema.safeParse(validSignUp).success).toBe(true)
	})

	it('rejects a name shorter than 3 characters', () => {
		expect(firstMessageFor({ ...validSignUp, name: 'Ан' }, 'name')).toContain('3')
	})

	it('accepts a name of exactly 3 characters', () => {
		expect(signUpSchema.safeParse({ ...validSignUp, name: 'Ася' }).success).toBe(true)
	})

	it('rejects a password shorter than 8 characters', () => {
		expect(firstMessageFor({ ...validSignUp, password: '1234567' }, 'password')).toContain('8')
	})

	it('accepts a password of exactly 8 characters', () => {
		expect(signUpSchema.safeParse({ ...validSignUp, password: '12345678' }).success).toBe(true)
	})

	it('rejects a malformed email', () => {
		expect(
			firstMessageFor({ ...validSignUp, email: 'user.example.com' }, 'email'),
		).toBeDefined()
	})

	it('requires the gender', () => {
		expect(firstMessageFor({ ...validSignUp, gender: null }, 'gender')).toBeDefined()
		expect(firstMessageFor({ ...validSignUp, gender: 'alien' }, 'gender')).toBeDefined()
	})

	it('accepts only male and female for a new registration', () => {
		expect(signUpSchema.safeParse({ ...validSignUp, gender: 'male' }).success).toBe(true)
		expect(signUpSchema.safeParse({ ...validSignUp, gender: 'female' }).success).toBe(true)
		expect(signUpSchema.safeParse({ ...validSignUp, gender: 'other' }).success).toBe(false)
	})

	it('accepts a missing age', () => {
		const { age, ...rest } = validSignUp
		void age

		expect(signUpSchema.safeParse(rest).success).toBe(true)
	})

	it('rejects an age outside the allowed range or not an integer, when provided', () => {
		expect(firstMessageFor({ ...validSignUp, age: 0 }, 'age')).toBeDefined()
		expect(firstMessageFor({ ...validSignUp, age: 121 }, 'age')).toBeDefined()
		expect(firstMessageFor({ ...validSignUp, age: 28.5 }, 'age')).toBeDefined()
	})

	it('accepts the boundary ages', () => {
		expect(signUpSchema.safeParse({ ...validSignUp, age: 1 }).success).toBe(true)
		expect(signUpSchema.safeParse({ ...validSignUp, age: 120 }).success).toBe(true)
	})

	it('accepts a missing last name', () => {
		expect(signUpSchema.safeParse(validSignUp).success).toBe(true)
	})

	it('rejects a last name shorter than 3 characters, when provided', () => {
		expect(firstMessageFor({ ...validSignUp, lastName: 'Ан' }, 'lastName')).toContain('3')
	})

	it('accepts a last name of exactly 3 characters', () => {
		expect(signUpSchema.safeParse({ ...validSignUp, lastName: 'Ася' }).success).toBe(true)
	})

	it('requires the role', () => {
		expect(firstMessageFor({ ...validSignUp, role: null }, 'role')).toBeDefined()
		expect(firstMessageFor({ ...validSignUp, role: 'alien' }, 'role')).toBeDefined()
	})

	it('accepts every role value', () => {
		for (const role of ['developer', 'analyst', 'student', 'beginner']) {
			expect(signUpSchema.safeParse({ ...validSignUp, role }).success).toBe(true)
		}
	})
})

describe('signInSchema', () => {
	it('accepts an email and a password', () => {
		expect(signInSchema.safeParse({ email: 'user@example.com', password: 'x' }).success).toBe(
			true,
		)
	})

	it('rejects an empty password', () => {
		expect(signInSchema.safeParse({ email: 'user@example.com', password: '' }).success).toBe(
			false,
		)
	})

	it('rejects a malformed email', () => {
		expect(signInSchema.safeParse({ email: 'nope', password: '12345678' }).success).toBe(false)
	})
})
