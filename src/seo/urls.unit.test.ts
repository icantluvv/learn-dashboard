import { describe, expect, it } from 'vitest'

import { clientEnvironment } from '#/env/client'
import { absoluteUrl } from '#/seo/urls'

describe('absoluteUrl', () => {
	it('собирает абсолютный адрес от публичного базового адреса приложения', () => {
		expect(absoluteUrl('/catalog')).toBe(
			new URL('/catalog', clientEnvironment.NEXT_PUBLIC_FRONT_URL).toString(),
		)
	})

	it('не порождает двойных слешей для корня и вложенных путей', () => {
		for (const path of ['/', '/catalog', '/catalog/frontend'] as const) {
			expect(absoluteUrl(path).replace(/^https?:\/\//, '')).not.toContain('//')
		}
	})
})
