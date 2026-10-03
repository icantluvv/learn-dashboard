import { redirect } from 'next/navigation'

import { getCurrentUser } from '#/lib/auth/get-session'
import { resolveRedirectPath, signInAction } from '#/modules/auth'
import { buildPageMetadata } from '#/seo'
import { SignInForm } from '@/(auth)/sign-in/_components/sign-in-form'

export const metadata = buildPageMetadata({
	title: 'Вход',
	description: 'Войдите в аккаунт, чтобы продолжить подготовку и сохранять прогресс по навыкам.',
	path: '/sign-in',
})

interface SignInPageProps {
	searchParams: Promise<{ next?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
	const [user, { next }] = await Promise.all([getCurrentUser(), searchParams])

	if (user != null) {
		redirect(resolveRedirectPath(next))
	}

	return (
		<div className="page-wrapper flex flex-1 items-center justify-center">
			<SignInForm action={signInAction} redirectPath={resolveRedirectPath(next)} />
		</div>
	)
}
