import type { Metadata } from 'next'

import type { RoutePath } from '#/seo/urls'

import { BRAND_NAME, OG_LOCALE } from '#/seo/brand'

interface BuildPageMetadataOptions {
	description: string
	/** Закрывает страницу от индексации. Для приватных и служебных маршрутов. */
	noIndex?: boolean
	/** Путь маршрута без query-строки — он же канонический адрес страницы. */
	path: RoutePath
	/** Заголовок страницы без имени бренда: суффикс добавляет шаблон корневого layout. */
	title: string
}

/**
 * Собирает метаданные страницы: заголовок, описание, канонический адрес и текстовую разметку для
 * соцсетей.
 *
 * `canonical` и `og:url` задаются относительным путём — в абсолютный адрес их разворачивает Next.js
 * по `metadataBase` из корневого layout. Query-строка в canonical не попадает by construction: путь
 * приходит из сегментов маршрута, а не из `searchParams`.
 */
export function buildPageMetadata({
	description,
	noIndex = false,
	path,
	title,
}: BuildPageMetadataOptions): Metadata {
	return {
		title,
		description,
		alternates: { canonical: path },
		openGraph: {
			title,
			description,
			url: path,
			type: 'website',
			siteName: BRAND_NAME,
			locale: OG_LOCALE,
		},
		twitter: {
			card: 'summary',
			title,
			description,
		},
		...(noIndex ? { robots: { index: false, follow: false } } : {}),
	}
}
