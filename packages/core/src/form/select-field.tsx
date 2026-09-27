'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FieldShell } from './field-shell'
import { useFieldContext } from './form-context'
import { useFieldState } from './use-field-state'

export interface SelectFieldOption {
	label: string
	value: string
}

interface SelectFieldProps {
	className?: string
	label: string
	options: readonly SelectFieldOption[]
	placeholder: string
	required?: boolean
}

export function SelectField({
	className,
	label,
	options,
	placeholder,
	required,
}: SelectFieldProps) {
	const field = useFieldContext<string | null>()
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
			<Select
				name={field.name}
				value={field.state.value}
				onValueChange={(value: string | null) => field.handleChange(value)}
				onOpenChangeComplete={(open) => {
					if (!open) {
						field.handleBlur()
					}
				}}
			>
				<SelectTrigger
					id={id}
					className="w-full"
					aria-invalid={isInvalid}
					aria-describedby={isInvalid ? errorId : undefined}
					aria-required={required}
				>
					<SelectValue>
						{(value: string | null) =>
							options.find((option) => option.value === value)?.label ?? placeholder
						}
					</SelectValue>
				</SelectTrigger>

				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FieldShell>
	)
}
