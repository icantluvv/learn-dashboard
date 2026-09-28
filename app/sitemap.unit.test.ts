import { describe, expect, it } from 'vitest'

import sitemap from './sitemap'

const urls = () => sitemap().map((entry) => new URL(entry.url).pathname)

describe('sitemap', () => {
	it('перечисляет реальные маршруты входа и регистрации', () => {
		expect(urls()).toStrictEqual(expect.arrayContaining(['/sign-in', '/sign-up']))
	})

	it('не содержит несуществующих адресов прежней схемы маршрутов', () => {
		expect(urls()).not.toStrictEqual(expect.arrayContaining(['/login']))
		expect(urls()).not.toStrictEqual(expect.arrayContaining(['/registration']))
	})

	it('содержит главную страницу и список направлений', () => {
		expect(urls()).toStrictEqual(expect.arrayContaining(['/', '/catalog']))
	})

	it('содержит по адресу на каждое известное направление', async () => {
		const { SKILL_CORES } = await import('#/constants/skill-cores')

		expect(urls()).toStrictEqual(
			expect.arrayContaining(SKILL_CORES.map((core) => `/catalog/${core}`)),
		)
	})

	it('не предлагает поисковику приватные маршруты', () => {
		expect(urls()).not.toStrictEqual(expect.arrayContaining(['/profile']))
	})

	it('отдаёт главную с наивысшим приоритетом', () => {
		const home = sitemap().find((entry) => new URL(entry.url).pathname === '/')

		expect(home?.priority).toBe(1)
	})
})
