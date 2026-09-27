import { redirect } from 'next/navigation'

import { getCurrentUser } from '#/lib/auth/get-session'
import { signInAction } from '#/modules/auth'
import { SignInForm } from '@/(auth)/sign-in/_components/sign-in-form'

export default async function SignInPage() {
	const user = await getCurrentUser()

	if (user != null) {
		redirect('/')
	}

	return (
		<div className="page-wrapper flex flex-1 items-center justify-center">
			<SignInForm action={signInAction} />
		</div>
	)
}
