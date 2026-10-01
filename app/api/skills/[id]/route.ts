import { NextResponse } from 'next/server'

import { getCurrentUser } from '#/lib/auth/get-session'
import { isSkillCompleted } from '#/modules/skills/server/skill-completion-repository.server'
import { getSkillById } from '#/modules/skills/server/skills-repository'

interface RouteContext {
	params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
	const { id } = await params
	const [skill, user] = await Promise.all([getSkillById(id), getCurrentUser()])

	if (skill == null) {
		return NextResponse.json({ error: 'not_found' }, { status: 404 })
	}

	return NextResponse.json(
		user == null ? skill : { ...skill, completed: await isSkillCompleted(user.id, id) },
		{ headers: { 'Cache-Control': 'no-store' } },
	)
}
