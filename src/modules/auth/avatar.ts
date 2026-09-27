export const AVATAR_MAX_BYTES = 5 * 1024 * 1024
export const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp'

const allowedAvatarTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export interface ValidatedAvatar {
	bytes: Uint8Array
	contentType: string
}

export function getAvatarFileError(file: File): string | undefined {
	if (!allowedAvatarTypes.has(file.type)) {
		return 'Выберите изображение в формате JPEG, PNG или WebP'
	}

	if (file.size === 0) {
		return 'Выбранный файл пуст'
	}

	if (file.size > AVATAR_MAX_BYTES) {
		return 'Размер изображения не должен превышать 5 МБ'
	}

	return undefined
}

function hasBytes(bytes: Uint8Array, offset: number, expected: readonly number[]) {
	return expected.every((value, index) => bytes[offset + index] === value)
}

function hasValidSignature(bytes: Uint8Array, contentType: string) {
	switch (contentType) {
		case 'image/jpeg': {
			return hasBytes(bytes, 0, [0xff, 0xd8, 0xff])
		}
		case 'image/png': {
			return hasBytes(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
		}
		case 'image/webp': {
			return (
				hasBytes(bytes, 0, [0x52, 0x49, 0x46, 0x46]) &&
				hasBytes(bytes, 8, [0x57, 0x45, 0x42, 0x50])
			)
		}
		default: {
			return false
		}
	}
}

export async function validateAvatarFile(file: File): Promise<string | ValidatedAvatar> {
	const fileError = getAvatarFileError(file)

	if (fileError != null) {
		return fileError
	}

	const bytes = new Uint8Array(await file.arrayBuffer())

	if (!hasValidSignature(bytes, file.type)) {
		return 'Содержимое файла не соответствует формату изображения'
	}

	return { bytes, contentType: file.type }
}
