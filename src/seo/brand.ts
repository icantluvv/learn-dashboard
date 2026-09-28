/**
 * Единственный источник правды для имени продукта и базовых SEO-строк.
 *
 * Бренд намеренно живёт в коде, а не в переменных окружения: метаданные не должны расходиться между
 * стендами из-за незаполненной переменной. `NEXT_PUBLIC_APP_NAME` для этого не подходит — это
 * идентификатор стенда (см. `#/constants/env`), а не имя продукта.
 */

export const BRAND_NAME = 'StarSkills'

export const BRAND_SHORT_NAME = 'StarSkills'

export const SITE_DESCRIPTION =
	'Платформа подготовки к собеседованиям и повышения грейда: навыки, темы и вопросы для ' +
	'самопроверки по направлениям Frontend, Backend, DevOps и Design.'

/** Шаблон заголовка для вложенных сегментов: собственный заголовок страницы плюс бренд. */
export const TITLE_TEMPLATE = `%s — ${BRAND_NAME}`

/** Заголовок по умолчанию: применяется к сегментам, не задавшим собственный `title`. */
export const DEFAULT_TITLE = `${BRAND_NAME} — подготовка к собеседованиям и рост грейда`

export const OG_LOCALE = 'ru_RU'

/** Язык контента приложения. Используется в `<html lang>` и в манифесте. */
export const CONTENT_LANGUAGE = 'ru'
