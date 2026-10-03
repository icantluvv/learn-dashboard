import type { Gender, Role } from './constants'

import { headers } from 'next/headers'
import { cache } from 'react'

import { auth } from './server'

import 'server-only'

export interface CurrentUser {
	age?: number
	completedSkillsCount?: number
	email: string
	gender: Gender
	id: string
	image?: string
	lastName?: string
	name: string
	role: Role
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
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
		role: user.role,
		completedSkillsCount: user.completedSkillsCount ?? 0,
		...(user.age == null ? {} : { age: user.age }),
		...(user.image == null ? {} : { image: user.image }),
		...(user.lastName == null ? {} : { lastName: user.lastName }),
	}
})
