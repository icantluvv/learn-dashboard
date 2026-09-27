import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { ThemeProvider } from '#/components/providers/theme-provider'

import { ThemeToggle } from './theme-toggle'

describe('<ThemeToggle />', () => {
	beforeEach(() => {
		localStorage.removeItem('theme')
		document.documentElement.classList.remove('dark', 'light')
	})

	it('открывает меню с пунктами Светлая/Тёмная/Системная', async () => {
		const view = await render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>,
		)

		await view.getByRole('button', { name: 'Переключить тему' }).click()

		await expect.element(view.getByRole('menuitem', { name: 'Светлая' })).toBeVisible()
		await expect.element(view.getByRole('menuitem', { name: 'Тёмная' })).toBeVisible()
		await expect.element(view.getByRole('menuitem', { name: 'Системная' })).toBeVisible()
	})

	it('выбор «Тёмная» включает класс dark на документе', async () => {
		const view = await render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>,
		)

		await view.getByRole('button', { name: 'Переключить тему' }).click()
		await view.getByRole('menuitem', { name: 'Тёмная' }).click()

		await expect.element(document.documentElement).toHaveClass('dark')
	})

	it('выбор «Светлая» после тёмной возвращает класс light', async () => {
		const view = await render(
			<ThemeProvider>
				<ThemeToggle />
			</ThemeProvider>,
		)

		await view.getByRole('button', { name: 'Переключить тему' }).click()
		await view.getByRole('menuitem', { name: 'Тёмная' }).click()
		await expect.element(document.documentElement).toHaveClass('dark')

		await view.getByRole('button', { name: 'Переключить тему' }).click()
		await view.getByRole('menuitem', { name: 'Светлая' }).click()

		await expect.element(document.documentElement).toHaveClass('light')
	})
})
