import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@repo/core/src/utils/cn'

interface SwitchProps extends SwitchPrimitive.Root.Props {
	thumbClassName?: string
}

function Switch({ children, className, thumbClassName, ...props }: SwitchProps) {
	return (
		<SwitchPrimitive.Root data-slot="switch" render={<button type="button" />} className={cn(`
				peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full
				border border-transparent bg-input shadow-xs transition-colors outline-none
				focus-visible:ring-3 focus-visible:ring-ring/50
				data-checked:bg-primary
				data-disabled:cursor-not-allowed data-disabled:opacity-50
			`, className)} nativeButton {...props}>
			<SwitchPrimitive.Thumb data-slot="switch-thumb" className={cn(`
				pointer-events-none block size-4 translate-x-0.5 rounded-full bg-background shadow-lg
				ring-0 transition-transform
				data-checked:translate-x-4
			`, thumbClassName)} />
			{children}
		</SwitchPrimitive.Root>
	)
}

export { Switch }
