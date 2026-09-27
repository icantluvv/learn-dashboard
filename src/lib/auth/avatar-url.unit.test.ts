import { describe, expect, it } from 'vitest'

import { getAvatarDisplayUrl } from './avatar-url'

describe('getAvatarDisplayUrl', () => {
	it('turns a stored same-origin avatar URL into a local image path', () => {
		expect(
			getAvatarDisplayUrl(
				'https://app.example.com/api/avatars/8f3b1c2e-2f5a-4a1e-9f3a-1d2c3b4a5e6f',
			),
		).toBe('/api/avatars/8f3b1c2e-2f5a-4a1e-9f3a-1d2c3b4a5e6f')
	})

	it('keeps unrelated image URLs unchanged', () => {
		expect(getAvatarDisplayUrl('https://storage.example.com/avatar.png')).toBe(
			'https://storage.example.com/avatar.png',
		)
	})
})
