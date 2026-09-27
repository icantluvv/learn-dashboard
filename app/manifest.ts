import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: '#1c2637',
		description: 'Сервис для подготовки по фронтенду: навыки, темы и вопросы для самопроверки',
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
				src: '/icon-maskable-512.png',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		id: '/',
		lang: 'ru',
		name: 'Learn Frontend',
		orientation: 'portrait',
		scope: '/',
		short_name: 'Learn FE',
		start_url: '/',
		theme_color: '#1c2637',
	}
}
