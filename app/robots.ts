import type { MetadataRoute } from 'next'

import { isProductionApp } from '#/constants/env'
import { clientEnvironment } from '#/env/client'

export default function robots(): MetadataRoute.Robots {
	if (!isProductionApp) {
		return {
			rules: {
				disallow: '/',
				userAgent: '*',
			},
		}
	}

	return {
		rules: {
			allow: '/',
			userAgent: '*',
		},
		sitemap: `${clientEnvironment.NEXT_PUBLIC_FRONT_URL}/sitemap.xml`,
	}
}
