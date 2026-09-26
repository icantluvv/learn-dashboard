'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { cn } from '@repo/core/src/utils/cn'

const Popover = PopoverPrimitive.Root

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverPortal({ ...props }: PopoverPrimitive.Portal.Props) {
	return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
	return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
	return (
		<PopoverPrimitive.Title
			data-slot="popover-title"
			className={cn('text-base font-semibold', className)}
			{...props}
		/>
	)
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
	return (
		<PopoverPrimitive.Description
			data-slot="popover-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}

function PopoverContent({
	align = 'center',
	alignOffset = 0,
	className,
	side = 'bottom',
	sideOffset = 8,
	...props
}: Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> &
	PopoverPrimitive.Popup.Props) {
	return (
		<PopoverPortal>
			<PopoverPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				className="isolate z-50"
			>
				<PopoverPrimitive.Popup data-slot="popover-content" className={cn(`
					origin-(--transform-origin) rounded-xl bg-popover p-4 text-sm
					text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100
					outline-none
					data-[side=bottom]:slide-in-from-top-2
					data-[side=left]:slide-in-from-right-2
					data-[side=right]:slide-in-from-left-2
					data-[side=top]:slide-in-from-bottom-2
					data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
					data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
				`, className)} {...props} />
			</PopoverPrimitive.Positioner>
		</PopoverPortal>
	)
}

export {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverPortal,
	PopoverTitle,
	PopoverTrigger,
}
