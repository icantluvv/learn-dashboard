'use client'

import type { ComponentProps } from 'react'

import { Input } from '../ui/input'
import { FieldShell } from './field-shell'
import { useFieldContext } from './form-context'
import { useFieldState } from './use-field-state'

type NumberFieldProps = Omit<
	ComponentProps<'input'>,
	'id' | 'name' | 'onBlur' | 'onChange' | 'type' | 'value'
> & {
	className?: string
	label: string
}

export function NumberField({ className, label, ...props }: NumberFieldProps) {
	const field = useFieldContext<number | null>()
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
				type="number"
				inputMode="numeric"
				name={field.name}
				value={field.state.value ?? ''}
				aria-invalid={isInvalid}
				aria-describedby={isInvalid ? errorId : undefined}
				onBlur={field.handleBlur}
				onChange={(event) => {
					const { value } = event.target
					field.handleChange(value === '' ? null : Number(value))
				}}
				{...props}
			/>
		</FieldShell>
	)
}
