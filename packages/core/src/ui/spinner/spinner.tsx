import { cn } from '@repo/core/src/utils/cn'
import { LoaderIcon } from 'lucide-react'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
	return (
		<LoaderIcon
			role="status"
			aria-label="Загрузка"
			className={cn('size-4 animate-spin', className)}
			{...props}
		/>
	)
}

export { Spinner }
