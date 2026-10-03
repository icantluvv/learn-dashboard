import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { ThemeProvider } from '#/components/providers/theme-provider'

import { ThemeToggle } from './theme-toggle'

describe('<ThemeToggle />', () => {
	beforeEach(() => {
		localStorage.removeItem('theme')
		document.documentElement.classList.remove('dark', 'light')
	})

	it('клик по кнопке переключает тему на тёмную', async () => {
		const view = await render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>,
		)

		await view.getByRole('button', { name: 'Переключить тему' }).click()

		await expect.element(document.documentElement).toHaveClass('dark')
	})

	it('повторный клик возвращает светлую тему', async () => {
		const view = await render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>,
		)

		const button = view.getByRole('button', { name: 'Переключить тему' })

		await button.click()
		await expect.element(document.documentElement).toHaveClass('dark')

		await button.click()
		await expect.element(document.documentElement).toHaveClass('light')
	})
})
