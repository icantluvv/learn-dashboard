import type { MetadataRoute } from 'next'

import { clientEnvironment } from '#/env/client'

type PublicSitemapPath = `/${string}`

export const PUBLIC_SITEMAP_PATHS = [
	'/',
	'/login',
	'/registration',
] as const satisfies readonly PublicSitemapPath[]

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()

	return PUBLIC_SITEMAP_PATHS.map((path) => ({
		changeFrequency: 'yearly',
		lastModified,
		priority: path === '/' ? 1 : 0.7,
		url: new URL(path, clientEnvironment.NEXT_PUBLIC_FRONT_URL).toString(),
	}))
}
