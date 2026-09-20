export function isDefined<T>(v: T): v is Exclude<T, null | undefined> {
	return v != null
}

export function isNull(v: unknown): v is null {
	return v === null
}

export function isNotNull<T>(v: T | null): v is T {
	return v !== null
}

export const isBrowser = isDefined(globalThis.window) && isDefined(globalThis.document)
