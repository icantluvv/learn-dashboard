import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { nextNavigationMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

import { BottomNav } from './bottom-nav'

describe('<BottomNav />', () => {
	beforeEach(() => {
		resetNextNavigationMock()
	})

	it('содержит ссылки на /, /catalog и /profile', async () => {
		const view = await render(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.toHaveAttribute('href', '/')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('href', '/catalog')
		await expect
			.element(view.getByRole('link', { name: 'Аккаунт' }))
			.toHaveAttribute('href', '/profile')
	})

	it('подсвечивает активный раздел', async () => {
		nextNavigationMock.pathname = '/catalog/js-closures'

		const view = await render(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Аккаунт' }))
			.not.toHaveAttribute('aria-current')
	})

	it('подсвечивает вкладку «Аккаунт» на /profile', async () => {
		nextNavigationMock.pathname = '/profile'

		const view = await render(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Аккаунт' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.not.toHaveAttribute('aria-current')
	})

	it('не подсвечивает ничего вне разделов навигации', async () => {
		nextNavigationMock.pathname = '/sign-in'

		const view = await render(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Аккаунт' }))
			.not.toHaveAttribute('aria-current')
	})
})
