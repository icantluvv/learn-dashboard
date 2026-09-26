import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { nextNavigationMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

import { BottomNav } from './bottom-nav'

describe('<BottomNav />', () => {
	beforeEach(() => {
		resetNextNavigationMock()
	})

	it('содержит ссылки на / и /catalog и слот профиля', async () => {
		const view = await render(<BottomNav profile={<span>Профиль</span>} />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.toHaveAttribute('href', '/')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('href', '/catalog')
		await expect.element(view.getByText('Профиль')).toBeVisible()
	})

	it('подсвечивает активный раздел', async () => {
		nextNavigationMock.pathname = '/catalog/js-closures'

		const view = await render(<BottomNav profile={null} />)

		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
	})

	it('не подсвечивает ничего вне разделов навигации', async () => {
		nextNavigationMock.pathname = '/sign-in'

		const view = await render(<BottomNav profile={null} />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.not.toHaveAttribute('aria-current')
	})
})
