import { getAuthMe200Schema } from '@repo/api/base/codegen/zod/meController/getAuthMeSchema'
import { NextResponse } from 'next/server'

import { getCurrentUser } from '#/lib/auth/get-session'

export async function GET() {
	const user = await getCurrentUser()

	if (user == null) {
		return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
	}

	return NextResponse.json(getAuthMe200Schema.parse(user), {
		headers: { 'Cache-Control': 'no-store' },
	})
}
