'use client'

import type { ReactNode } from 'react'

import { cn } from '@repo/core/src/utils/cn'

interface FieldShellProps {
	children: ReactNode
	className?: string
	errorId: string
	id: string
	isInvalid: boolean
	label: string
	message?: string
	required?: boolean
}

export function FieldShell({
	children,
	className,
	errorId,
	id,
	isInvalid,
	label,
	message,
	required,
}: FieldShellProps) {
	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			<label htmlFor={id} className="text-sm font-medium">
				{label}
				{required === true ? (
					<span aria-hidden="true" className="ml-0.5 text-destructive">
						*
					</span>
				) : null}
			</label>

			{children}

			{isInvalid ? (
				<p id={errorId} role="alert" className="text-sm text-destructive">
					{message}
				</p>
			) : null}
		</div>
	)
}
