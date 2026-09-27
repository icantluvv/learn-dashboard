import { getAuthDbPool } from '#/lib/auth/database.server'

import 'server-only'

export interface AvatarRecord {
	byteLength: number
	bytes: Uint8Array
	contentType: string
}

interface SaveAvatarInput extends AvatarRecord {
	id: string
	userId: string
}

interface AvatarRow {
	byte_length: number
	content_type: string
	data: Buffer
}

export async function saveAvatar({ byteLength, bytes, contentType, id, userId }: SaveAvatarInput) {
	await getAuthDbPool().query(
		`insert into user_avatar (id, user_id, content_type, byte_length, data)
		 values ($1, $2, $3, $4, $5)`,
		[id, userId, contentType, byteLength, Buffer.from(bytes)],
	)
}

export async function getAvatar(id: string): Promise<AvatarRecord | null> {
	const result = await getAuthDbPool().query<AvatarRow>(
		`select content_type, byte_length, data
		 from user_avatar
		 where id = $1`,
		[id],
	)
	const row = result.rows[0]

	if (row == null) {
		return null
	}

	return {
		bytes: new Uint8Array(row.data),
		contentType: row.content_type,
		byteLength: row.byte_length,
	}
}

export async function deleteUserAfterAvatarFailure(userId: string) {
	await getAuthDbPool().query('delete from "user" where "id" = $1', [userId])
}
