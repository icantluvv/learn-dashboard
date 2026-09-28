import { describe, expect, it } from 'vitest'

import { BRAND_NAME, OG_LOCALE } from '#/seo/brand'
import { buildPageMetadata } from '#/seo/build-metadata'

describe('buildPageMetadata', () => {
	it('задаёт канонический адрес равным пути маршрута', () => {
		const metadata = buildPageMetadata({
			title: 'Направления обучения',
			description: 'Выберите направление подготовки.',
			path: '/catalog',
		})

		expect(metadata.alternates?.canonical).toBe('/catalog')
	})

	it('не переносит query-параметры в канонический адрес', () => {
		const metadata = buildPageMetadata({
			title: 'Frontend',
			description: 'Подготовка по frontend.',
			path: '/catalog/frontend',
		})

		expect(metadata.alternates?.canonical).toBe('/catalog/frontend')
	})

	it('согласует Open Graph с заголовком, описанием и каноническим адресом', () => {
		const title = 'Frontend'
		const description = 'Подготовка по frontend.'

		const metadata = buildPageMetadata({ title, description, path: '/catalog/frontend' })

		expect(metadata.openGraph).toMatchObject({
			title,
			description,
			url: '/catalog/frontend',
			type: 'website',
			siteName: BRAND_NAME,
			locale: OG_LOCALE,
		})
	})

	it('согласует Twitter-разметку с метаданными страницы', () => {
		const title = 'Вход'
		const description = 'Войдите в аккаунт.'

		const metadata = buildPageMetadata({ title, description, path: '/sign-in' })

		expect(metadata.twitter).toMatchObject({ card: 'summary', title, description })
	})

	it('закрывает страницу от индексации при noIndex', () => {
		const metadata = buildPageMetadata({
			title: 'Профиль',
			description: 'Личные данные аккаунта.',
			path: '/profile',
			noIndex: true,
		})

		expect(metadata.robots).toStrictEqual({ index: false, follow: false })
	})

	it('не добавляет запрещающую директиву robots публичным страницам', () => {
		const metadata = buildPageMetadata({
			title: 'Главная',
			description: 'Личный прогресс подготовки.',
			path: '/',
		})

		expect(metadata.robots).toBeUndefined()
	})
})
