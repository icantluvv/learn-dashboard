import type { MetadataRoute } from 'next'

import type { RoutePath } from '#/seo'

import { SKILL_CORES } from '#/constants/skill-cores'
import { absoluteUrl } from '#/seo'

interface PublicSitemapEntry {
	path: RoutePath
	priority: number
}

/**
 * Публичные адреса приложения. Приватные маршруты (`/profile`) сюда не попадают — они закрыты
 * `noindex` и не должны предлагаться поисковику.
 *
 * Направления выводятся из `SKILL_CORES`, поэтому новое направление попадает в карту сайта без
 * правки этого файла.
 */
export const PUBLIC_SITEMAP_ENTRIES: readonly PublicSitemapEntry[] = [
	{ path: '/', priority: 1 },
	{ path: '/catalog', priority: 0.8 },
	...SKILL_CORES.map((core) => ({ path: `/catalog/${core}` as RoutePath, priority: 0.8 })),
	{ path: '/sign-in', priority: 0.5 },
	{ path: '/sign-up', priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()

	return PUBLIC_SITEMAP_ENTRIES.map(({ path, priority }) => ({
		changeFrequency: 'yearly',
		lastModified,
		priority,
		url: absoluteUrl(path),
	}))
}
