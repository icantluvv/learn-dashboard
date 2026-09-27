import { beforeEach, describe, expect, it, vi } from 'vitest'

interface QueryResult {
	rows: unknown[]
}

const query = vi.fn<(text: string, values?: unknown[]) => Promise<QueryResult>>()

vi.mock('#/lib/auth/database.server', () => ({
	getAuthDbPool: () => ({ query }),
}))

const { deleteUserAfterAvatarFailure, getAvatar, saveAvatar } =
	await import('./avatar-repository.server')

describe('avatar repository', () => {
	beforeEach(() => {
		query.mockReset()
	})

	it('stores avatar bytes and metadata for a user', async () => {
		query.mockResolvedValue({ rows: [] })
		const bytes = new Uint8Array([1, 2, 3])

		await saveAvatar({
			id: 'avatar-1',
			userId: 'user-1',
			contentType: 'image/png',
			byteLength: 3,
			bytes,
		})

		expect(query).toHaveBeenCalledWith(expect.stringContaining('insert into user_avatar'), [
			'avatar-1',
			'user-1',
			'image/png',
			3,
			Buffer.from(bytes),
		])
	})

	it('reads an avatar without exposing user data', async () => {
		query.mockResolvedValue({
			rows: [{ content_type: 'image/webp', byte_length: 3, data: Buffer.from([1, 2, 3]) }],
		})

		await expect(getAvatar('avatar-1')).resolves.toStrictEqual({
			contentType: 'image/webp',
			byteLength: 3,
			bytes: new Uint8Array([1, 2, 3]),
		})
	})

	it('deletes only the user created by the failed registration', async () => {
		query.mockResolvedValue({ rows: [] })

		await deleteUserAfterAvatarFailure('user-1')

		expect(query).toHaveBeenCalledWith('delete from "user" where "id" = $1', ['user-1'])
	})
})
