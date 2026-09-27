const signatures = {
	'image/jpeg': [0xff, 0xd8, 0xff, 0xd9],
	'image/png': [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
	'image/webp': [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
} as const

type AvatarContentType = keyof typeof signatures

export function createAvatarFile(
	contentType: AvatarContentType = 'image/png',
	size: number = signatures[contentType].length,
) {
	const bytes = new Uint8Array(size)
	bytes.set(signatures[contentType].slice(0, size))
	const extension = contentType.slice('image/'.length)

	return new File([bytes], `avatar.${extension}`, { type: contentType })
}

export function createSpoofedAvatarFile() {
	return new File(['not an image'], 'avatar.png', { type: 'image/png' })
}
