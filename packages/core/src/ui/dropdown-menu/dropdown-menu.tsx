'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { cn } from '@repo/core/src/utils/cn'

const DropdownMenu = MenuPrimitive.Root

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
	return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
	return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuContent({
	align = 'end',
	alignOffset = 0,
	className,
	side = 'bottom',
	sideOffset = 8,
	...props
}: MenuPrimitive.Popup.Props &
	Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
	return (
		<DropdownMenuPortal>
			<MenuPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				className="isolate z-50"
			>
				<MenuPrimitive.Popup data-slot="dropdown-menu-content" className={cn(`
					min-w-36 origin-(--transform-origin) rounded-xl bg-popover p-1 text-sm
					text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100
					outline-none
					data-[side=bottom]:slide-in-from-top-2
					data-[side=left]:slide-in-from-right-2
					data-[side=right]:slide-in-from-left-2
					data-[side=top]:slide-in-from-bottom-2
					data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
					data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
				`, className)} {...props} />
			</MenuPrimitive.Positioner>
		</DropdownMenuPortal>
	)
}

function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
	return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cn(`
				flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none
				select-none
				data-highlighted:bg-muted data-highlighted:text-foreground
			`, className)} {...props} />
}

export {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
}
