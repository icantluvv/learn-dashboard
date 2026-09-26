import type { Gender } from './constants'

import { headers } from 'next/headers'

import { auth } from './server'

import 'server-only'

export interface CurrentUser {
	age: number
	email: string
	gender: Gender
	id: string
	image?: string
	name: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
	const session = await auth.api.getSession({ headers: await headers() })

	if (session == null) {
		return null
	}

	const { user } = session

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		gender: user.gender,
		age: user.age,
		...(user.image == null ? {} : { image: user.image }),
	}
}
