import { buttonVariants, cn } from '@repo/core'
import Link from 'next/link'

export function ProfileGuest() {
	return (
		<div className="v-stack w-full max-w-xs items-center gap-6 text-center">
			<p className="text-base text-muted-foreground">
				Войдите в профиль, чтобы увидеть свои данные
			</p>

			<div className="v-stack w-full gap-3">
				<Link href="/sign-in" className={cn(buttonVariants({ variant: 'default' }))}>
					Войти
				</Link>
				<Link href="/sign-up" className={cn(buttonVariants({ variant: 'outline' }))}>
					Регистрация
				</Link>
			</div>
		</div>
	)
}
