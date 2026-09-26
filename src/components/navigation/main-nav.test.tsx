import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { nextNavigationMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

import { MainNav } from './main-nav'

describe('<MainNav />', () => {
	beforeEach(() => {
		resetNextNavigationMock()
	})

	it('содержит ровно две ссылки на / и /catalog', async () => {
		const view = await render(<MainNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.toHaveAttribute('href', '/')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('href', '/catalog')
		await expect.element(view.getByRole('navigation')).toBeVisible()
	})

	it('подсвечивает «Главная» на /', async () => {
		nextNavigationMock.pathname = '/'

		const view = await render(<MainNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.not.toHaveAttribute('aria-current')
	})

	it('подсвечивает «Каталог» на вложенном маршруте каталога', async () => {
		nextNavigationMock.pathname = '/catalog/js-closures'

		const view = await render(<MainNav />)

		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
	})

	it('не подсвечивает ничего на маршруте вне навигации', async () => {
		nextNavigationMock.pathname = '/sign-in'

		const view = await render(<MainNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.not.toHaveAttribute('aria-current')
	})
})
