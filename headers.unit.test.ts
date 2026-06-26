import { describe, expect, it } from 'vitest'

import { headers } from './headers'

describe('security headers', () => {
	it('разрешает blob-URL для media-src в Content Security Policy', async () => {
		const headerConfigs = await headers?.()
		const securityHeaders = headerConfigs?.find(({ source }) => source === '/:path*')
		const cspHeader = securityHeaders?.headers.find(
			({ key }) => key === 'Content-Security-Policy',
		)

		expect(cspHeader?.value).toContain('media-src')
		expect(cspHeader?.value).toContain("media-src 'self' blob:")
	})
})
