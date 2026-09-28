import { clientEnvironment } from '#/env/client'

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
/**
 * Идентификатор production-стенда. Это не имя бренда (оно живёт в `#/seo`), а значение
 * `NEXT_PUBLIC_APP_NAME`, которым окружение помечает прод: от него зависят `app/robots.ts` и имя
 * Sentry-проекта. Переименование стенда правится здесь и в переменных окружения одновременно.
 */
export const PRODUCTION_APP_NAME = 'starskills'

export const isProductionApp = clientEnvironment.NEXT_PUBLIC_APP_NAME === PRODUCTION_APP_NAME

export function isBrowser() {
	return globalThis.window !== undefined
}
