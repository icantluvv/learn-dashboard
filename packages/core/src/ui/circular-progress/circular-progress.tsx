import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import { cn } from '@repo/core/src/utils/cn'

interface CircularProgressProps extends ProgressPrimitive.Root.Props {
	size?: number
	strokeWidth?: number
}

function CircularProgress({
	className,
	size = 56,
	strokeWidth = 6,
	value,
	...props
}: CircularProgressProps) {
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius
	const clampedValue = value == null ? 0 : Math.min(Math.max(value, 0), 100)
	const offset = circumference * (1 - clampedValue / 100)

	return (
		<ProgressPrimitive.Root
			data-slot="circular-progress"
			className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
			value={value}
			{...props}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
				aria-hidden="true"
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					className="stroke-brand-soft"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					className="stroke-brand-primary transition-[stroke-dashoffset] duration-500"
				/>
			</svg>
		</ProgressPrimitive.Root>
	)
}

export { CircularProgress }
