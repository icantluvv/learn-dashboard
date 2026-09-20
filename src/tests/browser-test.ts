export { expect, test, vi } from 'vitest'

export function jsonResponse(data: unknown, init?: ResponseInit) {
	return Response.json(data, init)
}
