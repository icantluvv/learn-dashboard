import { buttonVariants } from '@repo/core'
import Link from 'next/link'

export function GuestLinks() {
	return (
		<Link href="/sign-in" className={buttonVariants({ variant: 'default' })}>
			Войти
		</Link>
	)
}
