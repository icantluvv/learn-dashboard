import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: '#ffffff',
		description: '',
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
		name: '',
		short_name: '',
		start_url: '/',
		theme_color: '#ffffff',
	}
}
