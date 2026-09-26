'use client'

import type { ComponentProps } from 'react'

import { Input } from '../ui/input'
import { FieldShell } from './field-shell'
import { useFieldContext } from './form-context'
import { useFieldState } from './use-field-state'

type TextFieldProps = Omit<
	ComponentProps<'input'>,
	'id' | 'name' | 'onBlur' | 'onChange' | 'value'
> & {
	className?: string
	label: string
}

export function TextField({ className, label, ...props }: TextFieldProps) {
	const field = useFieldContext<string>()
	const { errorId, id, isInvalid, message } = useFieldState()

	return (
		<FieldShell
			label={label}
			id={id}
			errorId={errorId}
			message={message}
			isInvalid={isInvalid}
			className={className}
		>
			<Input
				id={id}
				name={field.name}
				value={field.state.value}
				aria-invalid={isInvalid}
				aria-describedby={isInvalid ? errorId : undefined}
				onBlur={field.handleBlur}
				onChange={(event) => field.handleChange(event.target.value)}
				{...props}
			/>
		</FieldShell>
	)
}
