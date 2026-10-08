import { NextResponse } from 'next/server'

import { getCurrentUser } from '#/lib/auth/get-session'
import { getCompletedSkillsByCore } from '#/modules/skills/server/skill-completion-repository.server'

export async function GET() {
	const user = await getCurrentUser()

	if (user == null) {
		return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
	}

	const groups = await getCompletedSkillsByCore(user.id)

	return NextResponse.json(groups, { headers: { 'Cache-Control': 'no-store' } })
}
