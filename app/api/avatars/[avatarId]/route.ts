import { NextResponse } from 'next/server'

import { getAvatar } from '#/modules/auth/avatar-repository.server'

interface RouteContext {
	params: Promise<{ avatarId: string }>
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GET(_request: Request, { params }: RouteContext) {
	const { avatarId } = await params

	if (!uuidPattern.test(avatarId)) {
		return NextResponse.json({ error: 'not_found' }, { status: 404 })
	}

	const avatar = await getAvatar(avatarId)

	if (avatar == null) {
		return NextResponse.json({ error: 'not_found' }, { status: 404 })
	}

	const body = new ArrayBuffer(avatar.byteLength)
	new Uint8Array(body).set(avatar.bytes)

	return new Response(body, {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable',
			'Content-Length': String(avatar.byteLength),
			'Content-Type': avatar.contentType,
			'X-Content-Type-Options': 'nosniff',
		},
	})
}
