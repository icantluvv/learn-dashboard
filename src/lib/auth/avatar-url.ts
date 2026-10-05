export function getAvatarDisplayUrl(image: string) {
	try {
		const url = new URL(image)

		if (url.pathname.startsWith('/api/avatars/')) {
			return `${url.pathname}${url.search}`
		}
	} catch {
		return image
	}

	return image
}

export function getAvatarIdFromImage(image: string): string | undefined {
	try {
		const url = new URL(image)
		const match = /^\/api\/avatars\/([^/]+)$/.exec(url.pathname)

		return match?.[1]
	} catch {
		return undefined
	}
}
