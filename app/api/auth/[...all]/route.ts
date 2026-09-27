import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '#/lib/auth/server'

const handlers = toNextJsHandler(auth)

const { GET, POST: handleAuthPost } = handlers

export { GET }

export async function POST(request: Request) {
	if (new URL(request.url).pathname.endsWith('/sign-up/email')) {
		return Response.json({ error: 'not_found' }, { status: 404 })
	}

	return handleAuthPost(request)
}
