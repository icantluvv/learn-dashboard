import { NextResponse } from 'next/server'

import { getSkillById } from '#/modules/skills/server/skills-repository'

interface RouteContext {
	params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
	const { id } = await params
	const skill = await getSkillById(id)

	if (skill == null) {
		return NextResponse.json({ error: 'not_found' }, { status: 404 })
	}

	return NextResponse.json(skill)
}
