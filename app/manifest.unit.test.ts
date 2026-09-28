import { describe, expect, it } from 'vitest'

import { BRAND_NAME, BRAND_SHORT_NAME, CONTENT_LANGUAGE, SITE_DESCRIPTION } from '#/seo'

import manifest from './manifest'

describe('web app manifest', () => {
	it('использует то же имя бренда и описание, что и метаданные', () => {
		expect(manifest()).toMatchObject({
			name: BRAND_NAME,
			short_name: BRAND_SHORT_NAME,
			description: SITE_DESCRIPTION,
			lang: CONTENT_LANGUAGE,
		})
	})

	it('сохраняет обязательные для установки поля непустыми', () => {
		const { description, display, name, short_name, start_url } = manifest()

		// Поля манифеста опциональны в типе `MetadataRoute.Manifest`, поэтому проверяем через
		// подстановку пустой строки: непустое значение — это и есть требование.
		expect(name ?? '').not.toHaveLength(0)
		expect(short_name ?? '').not.toHaveLength(0)
		expect(description ?? '').not.toHaveLength(0)
		expect(display).toBe('standalone')
		expect(start_url).toBe('/')
	})
})
