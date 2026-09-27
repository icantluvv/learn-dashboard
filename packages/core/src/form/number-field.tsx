'use client'

import type { ComponentProps } from 'react'

import { InputGroup, InputGroupInput } from '../ui/input-group'
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

export function NumberField({ className, label, required, ...props }: NumberFieldProps) {
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
			required={required}
		>
			<InputGroup>
				<InputGroupInput
					id={id}
					type="number"
					inputMode="numeric"
					name={field.name}
					value={field.state.value ?? ''}
					aria-invalid={isInvalid}
					aria-describedby={isInvalid ? errorId : undefined}
					required={required}
					onBlur={field.handleBlur}
					onChange={(event) => {
						const { value } = event.target
						field.handleChange(value === '' ? null : Number(value))
					}}
					{...props}
				/>
			</InputGroup>
		</FieldShell>
	)
}
