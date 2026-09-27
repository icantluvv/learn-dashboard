import type { GetAuthMe200 } from '@repo/api'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { nextNavigationMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'
import { renderWithProviders } from '#/tests/render'

const getAuthMe = vi.fn<() => Promise<GetAuthMe200>>()

vi.mock('@repo/api/base/codegen/clients/meController/getAuthMe', () => ({
	getAuthMe: async () => getAuthMe(),
}))

const { BottomNav } = await import('./bottom-nav')

describe('<BottomNav />', () => {
	beforeEach(() => {
		resetNextNavigationMock()
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))
	})

	it('содержит ссылки на / и /catalog, и кнопку «Меню»', async () => {
		const view = await renderWithProviders(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.toHaveAttribute('href', '/')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('href', '/catalog')
		await expect.element(view.getByRole('button', { name: 'Меню' })).toBeVisible()
	})

	it('подсвечивает активный раздел', async () => {
		nextNavigationMock.pathname = '/catalog/js-closures'

		const view = await renderWithProviders(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
	})

	it('не подсвечивает ничего вне разделов навигации', async () => {
		nextNavigationMock.pathname = '/sign-in'

		const view = await renderWithProviders(<BottomNav />)

		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.not.toHaveAttribute('aria-current')
	})

	it('кнопка «Меню» открывает AccountDrawer вместо перехода по ссылке', async () => {
		const view = await renderWithProviders(<BottomNav />)

		const accountButton = view.getByRole('button', { name: 'Меню' })

		await expect.element(accountButton).not.toHaveAttribute('href')

		await accountButton.click()

		await expect.element(view.getByRole('link', { name: 'Войти' })).toBeVisible()
	})
})
