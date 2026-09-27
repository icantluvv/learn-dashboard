import type { AvatarRecord } from '#/modules/auth/avatar-repository.server'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const getAvatar = vi.fn<(id: string) => Promise<AvatarRecord | null>>()

vi.mock('#/modules/auth/avatar-repository.server', () => ({
	getAvatar: async (id: string) => getAvatar(id),
}))

const { GET } = await import('./route')
const avatarId = '8f3b1c2e-2f5a-4a1e-9f3a-1d2c3b4a5e6f'

async function request(id = avatarId) {
	return GET(new Request(`http://localhost/api/avatars/${id}`), {
		params: Promise.resolve({ avatarId: id }),
	})
}

describe('get /api/avatars/[avatarId]', () => {
	beforeEach(() => {
		getAvatar.mockReset()
	})

	it('returns stored bytes with immutable and nosniff headers', async () => {
		const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
		getAvatar.mockResolvedValue({
			bytes,
			contentType: 'image/png',
			byteLength: bytes.byteLength,
		})

		const response = await request()

		expect(response.status).toBe(200)
		expect(new Uint8Array(await response.arrayBuffer())).toStrictEqual(bytes)
		expect(response.headers.get('content-type')).toBe('image/png')
		expect(response.headers.get('content-length')).toBe('4')
		expect(response.headers.get('x-content-type-options')).toBe('nosniff')
		expect(response.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
	})

	it('returns 404 without querying the database for an invalid UUID', async () => {
		const response = await request('not-a-uuid')

		expect(response.status).toBe(404)
		expect(getAvatar).not.toHaveBeenCalled()
	})

	it('returns 404 for a missing avatar', async () => {
		getAvatar.mockResolvedValue(null)

		const response = await request()

		expect(response.status).toBe(404)
	})
})
