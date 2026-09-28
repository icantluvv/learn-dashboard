import { clientEnvironment } from '#/env/client'

/** Путь маршрута приложения: всегда начинается со слеша, без домена и query-строки. */
export type RoutePath = `/${string}`

/**
 * Собирает абсолютный адрес маршрута от публичного базового адреса приложения.
 *
 * Метаданные страниц пользуются относительными путями и `metadataBase`, поэтому эта функция нужна
 * там, где Next.js не резолвит адрес сам: `sitemap.ts` и `robots.ts`.
 */
export function absoluteUrl(path: RoutePath): string {
	return new URL(path, clientEnvironment.NEXT_PUBLIC_FRONT_URL).toString()
}
