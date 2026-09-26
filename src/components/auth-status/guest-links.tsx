import Link from 'next/link'

export function GuestLinks() {
	return (
		<div className="flex items-center gap-3">
			<Link href="/sign-in" className="text-sm underline">
				Войти
			</Link>
			<Link href="/sign-up" className="text-sm underline">
				Регистрация
			</Link>
		</div>
	)
}
