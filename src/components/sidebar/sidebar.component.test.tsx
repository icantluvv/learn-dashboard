import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

import { ThemeProvider } from '#/components/providers/theme-provider'
import { BRAND_NAME } from '#/seo'
import { nextNavigationMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

vi.mock('#/components/auth-status', () => ({
	AuthStatusSlot: () => <div data-testid="account-slot">Аккаунт</div>,
}))

const { Sidebar } = await import('./sidebar')

describe('<Sidebar />', () => {
	beforeEach(async () => {
		resetNextNavigationMock()
		localStorage.removeItem('theme')
		document.documentElement.classList.remove('dark', 'light')
		// Sidebar рендерится только на lg+ (`hidden lg:flex`).
		await page.viewport(1280, 800)
	})

	it('содержит логотип, вертикальную навигацию и блок аккаунта', async () => {
		const view = await render(
			<ThemeProvider>
				<Sidebar />
			</ThemeProvider>,
		)

		await expect
			.element(view.getByRole('link', { name: `${BRAND_NAME} — на главную` }))
			.toBeVisible()
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.toHaveAttribute('href', '/')
		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('href', '/catalog')
		await expect.element(view.getByTestId('account-slot')).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Переключить тему' })).toBeVisible()
	})

	it('подсвечивает активный раздел', async () => {
		nextNavigationMock.pathname = '/catalog'

		const view = await render(
			<ThemeProvider>
				<Sidebar />
			</ThemeProvider>,
		)

		await expect
			.element(view.getByRole('link', { name: 'Каталог' }))
			.toHaveAttribute('aria-current', 'page')
		await expect
			.element(view.getByRole('link', { name: 'Главная' }))
			.not.toHaveAttribute('aria-current')
	})
})
