import type { RoutePath } from '#/seo'

export const DEFAULT_REDIRECT_PATH: RoutePath = '/profile'

const BLOCKED_PATHS = new Set(['/sign-in', '/sign-up'])

/**
 * Приводит переданный адрес возврата к безопасному внутреннему пути.
 *
 * Принимается только путь внутри приложения: абсолютный адрес, protocol-relative `//host` и вариант
 * с обратным слешем (`/\host`, который браузеры тоже трактуют как внешний хост) отвергаются, иначе
 * страница входа превращается в open redirect. Пути самих страниц входа и регистрации отвергаются
 * отдельно: возврат на них оставил бы пользователя на форме после успешного входа.
 */
export function resolveRedirectPath(value: string | string[] | undefined): RoutePath {
	if (typeof value !== 'string' || !value.startsWith('/')) {
		return DEFAULT_REDIRECT_PATH
	}

	if (value.startsWith('//') || value.startsWith('/\\')) {
		return DEFAULT_REDIRECT_PATH
	}

	const [pathname] = value.split(/[?#]/)

	if (pathname == null || BLOCKED_PATHS.has(pathname)) {
		return DEFAULT_REDIRECT_PATH
	}

	return value as RoutePath
}
