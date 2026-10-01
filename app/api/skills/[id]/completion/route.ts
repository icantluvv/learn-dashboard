import { setSkillCompletionMutationRequestSchema } from '@repo/api/base/codegen/zod/skillsController/setSkillCompletionSchema'
import { NextResponse } from 'next/server'

import { getCurrentUser } from '#/lib/auth/get-session'
import { setSkillCompletion } from '#/modules/skills/server/skill-completion-repository.server'

interface RouteContext {
	params: Promise<{ id: string }>
}

async function parseCompleted(request: Request): Promise<boolean | null> {
	let body: unknown

	try {
		body = await request.json()
	} catch {
		return null
	}

	const parsed = setSkillCompletionMutationRequestSchema.safeParse(body)

	return parsed.success ? parsed.data.completed : null
}

export async function PUT(request: Request, { params }: RouteContext) {
	const user = await getCurrentUser()

	if (user == null) {
		return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
	}

	const completed = await parseCompleted(request)

	if (completed == null) {
		return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
	}

	const { id } = await params
	const result = await setSkillCompletion(user.id, id, completed)

	if (result == null) {
		return NextResponse.json({ error: 'not_found' }, { status: 404 })
	}

	return NextResponse.json(
		{ completed, completedSkillsCount: result.completedSkillsCount },
		{ headers: { 'Cache-Control': 'no-store' } },
	)
}
