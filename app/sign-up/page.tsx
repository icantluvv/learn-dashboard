import { redirect } from 'next/navigation'

import { getCurrentUser } from '#/lib/auth/get-session'
import { signUpAction } from '#/modules/auth'
import { SignUpForm } from '@/sign-up/_components/sign-up-form'

export default async function SignUpPage() {
	const user = await getCurrentUser()

	if (user != null) {
		redirect('/')
	}

	return (
		<div className="page-wrapper flex justify-center">
			<SignUpForm action={signUpAction} />
		</div>
	)
}
