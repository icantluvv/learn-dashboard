'use client'

import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-context'
import { NumberField } from './number-field'
import { SelectField } from './select-field'
import { TextField } from './text-field'

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: { TextField, NumberField, SelectField },
	formComponents: {},
})

export type { SelectFieldOption } from './select-field'
