'use client'

import { useFieldContext } from './form-context'

export function useFieldState() {
	const field = useFieldContext<unknown>()
	const { isTouched } = field.state.meta
	const errors = field.state.meta.errors as (string | { message?: string })[]
	const firstError = errors[0]
	const message = typeof firstError === 'string' ? firstError : firstError?.message

	return {
		errorId: `field-${field.name}-error`,
		id: `field-${field.name}`,
		isInvalid: isTouched && message != null,
		message,
	}
}
