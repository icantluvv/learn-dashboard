import type { ComponentProps } from 'react'

import { cn } from '@repo/core'
import { LifeBuoyIcon } from 'lucide-react'

export function SupportFab({ className, ...props }: ComponentProps<'button'>) {
	return (
		<button type="button" aria-label="Поддержка" className={cn(`
			grid size-14 shrink-0 cursor-pointer place-items-center rounded-full bg-brand-primary
			text-white shadow-lg transition-[opacity,transform] duration-150 outline-none
			select-none
			hover:opacity-90
			focus-visible:ring-3 focus-visible:ring-ring/50
			active:scale-95
		`, className)} {...props}>
			<LifeBuoyIcon className="size-6" aria-hidden="true" />
		</button>
	)
}
