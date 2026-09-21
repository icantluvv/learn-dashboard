export function getSsrWidthFromUserAgent(userAgent: string): number {
	const isMobile = /iPhone|Android.*Mobile|Windows Phone/i.test(userAgent)
	const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)

	if (isMobile) {
		return 375
	}

	if (isTablet) {
		return 768
	}

	return 1280
}
