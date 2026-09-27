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
