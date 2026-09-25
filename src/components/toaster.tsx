'use client'

import type { ComponentProps } from 'react'

import { Toaster as CoreToaster } from '@repo/core'

export function Toaster(props: ComponentProps<typeof CoreToaster>) {
	return <CoreToaster {...props} />
}
