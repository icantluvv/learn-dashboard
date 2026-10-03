import type { Metadata } from 'next'

import type { RoutePath } from '#/seo/urls'

import { BRAND_NAME, OG_LOCALE } from '#/seo/brand'

interface BuildPageMetadataOptions {
	description: string
	noIndex?: boolean
	path: RoutePath
	title: string
}

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
