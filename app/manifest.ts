import type { MetadataRoute } from 'next'

import { BRAND_NAME, BRAND_SHORT_NAME, CONTENT_LANGUAGE, SITE_DESCRIPTION } from '#/seo'

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: '#1c2637',
		description: SITE_DESCRIPTION,
		display: 'standalone',
		icons: [
			{
				sizes: '192x192',
				src: '/icon-192.png',
				type: 'image/png',
				purpose: 'any',
			},
			{
				sizes: '512x512',
				src: '/icon-512.png',
				type: 'image/png',
				purpose: 'any',
			},
			{
				sizes: '512x512',
				src: '/icon-512.png',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		id: '/',
		lang: CONTENT_LANGUAGE,
		name: BRAND_NAME,
		orientation: 'portrait',
		scope: '/',
		short_name: BRAND_SHORT_NAME,
		start_url: '/',
		theme_color: '#1c2637',
	}
}
