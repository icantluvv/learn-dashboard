import { describe, expect, it } from 'vitest'

import { createAvatarFile, createSpoofedAvatarFile } from '#/tests/fixtures/avatar-files'

import { AVATAR_MAX_BYTES, getAvatarFileError, validateAvatarFile } from './avatar'

describe('avatar validation', () => {
	it.each(['image/jpeg', 'image/png', 'image/webp'] as const)(
		'accepts a valid %s file',
		async (contentType) => {
			const result = await validateAvatarFile(createAvatarFile(contentType))

			expect(result).not.toBeTypeOf('string')
		},
	)

	it('accepts exactly 5 MiB and rejects one byte more', () => {
		expect(getAvatarFileError(createAvatarFile('image/png', AVATAR_MAX_BYTES))).toBeUndefined()
		expect(getAvatarFileError(createAvatarFile('image/png', AVATAR_MAX_BYTES + 1))).toContain(
			'5 МБ',
		)
	})

	it('rejects an unsupported type and an empty file', () => {
		expect(
			getAvatarFileError(new File(['text'], 'avatar.txt', { type: 'text/plain' })),
		).toContain('JPEG')
		expect(getAvatarFileError(new File([], 'avatar.png', { type: 'image/png' }))).toContain(
			'пуст',
		)
	})

	it('rejects bytes that do not match the declared MIME type', async () => {
		await expect(validateAvatarFile(createSpoofedAvatarFile())).resolves.toContain('Содержимое')
	})
})
