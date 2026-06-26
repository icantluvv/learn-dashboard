import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: '#ffffff',
		description: 'Больше, чем путешествие',
		display: 'standalone',
		icons: [
			{
				sizes: '192x192',
				src: '/icon-192x192.png',
				type: 'image/png',
			},
			{
				sizes: '512x512',
				src: '/icon-512x512.png',
				type: 'image/png',
			},
		],
		name: 'БЧП',
		short_name: 'БЧП',
		start_url: '/',
		theme_color: '#ffffff',
	}
}
