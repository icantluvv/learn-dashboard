import { redirect } from 'next/navigation'

import { getCurrentUser } from '#/lib/auth/get-session'
import { DEFAULT_REDIRECT_PATH, signUpAction } from '#/modules/auth'
import { buildPageMetadata } from '#/seo'
import { SignUpForm } from '@/(auth)/sign-up/_components/sign-up-form'

export const metadata = buildPageMetadata({
	title: 'Регистрация',
	description:
		'Создайте аккаунт, чтобы отслеживать прогресс подготовки к собеседованию и повышения ' +
		'грейда по выбранным направлениям.',
	path: '/sign-up',
})

export default async function SignUpPage() {
	const user = await getCurrentUser()

	if (user != null) {
		redirect(DEFAULT_REDIRECT_PATH)
	}

	return (
		<div className="page-wrapper flex flex-1 items-center justify-center">
			<SignUpForm action={signUpAction} />
		</div>
	)
}
