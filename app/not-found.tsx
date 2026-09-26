import { buttonVariants, cn } from '@repo/core'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div
			className="page-wrapper v-stack items-center justify-center gap-10 text-center"
			data-testid="error-boundary"
		>
			<div className="v-stack gap-4">
				<h1 className="text-3xl font-semibold">Страница не найдена</h1>
				<p className="text-base text-muted-foreground">
					Запрошенная страница не&nbsp;существует или была перемещена. <br />
					Проверьте адрес или вернитесь на&nbsp;главную страницу.
				</p>
			</div>

			<Link className={cn(buttonVariants({ variant: 'outline' }))} href="/">
				На главную
			</Link>
		</div>
	)
}
