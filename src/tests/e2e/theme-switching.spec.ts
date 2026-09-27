import { expect, test } from './fixtures'

test('переключение темы через Sidebar сохраняется после перезагрузки', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('button', { name: 'Переключить тему' }).click()
	await page.getByRole('menuitem', { name: 'Тёмная' }).click()

	await expect(page.locator('html')).toHaveClass(/dark/)

	await page.reload()

	await expect(page.locator('html')).toHaveClass(/dark/)
})

test('переключение темы синхронизировано между Sidebar и AccountDrawer', async ({ page }) => {
	await page.goto('/')

	await page.getByRole('button', { name: 'Переключить тему' }).click()
	await page.getByRole('menuitem', { name: 'Тёмная' }).click()
	await expect(page.locator('html')).toHaveClass(/dark/)

	await page.setViewportSize({ width: 390, height: 844 })
	await page
		.getByRole('navigation', { name: 'Основная навигация' })
		.getByRole('button', { name: 'Меню' })
		.click()

	await page.getByRole('button', { name: 'Переключить тему' }).click()

	await expect(page.getByRole('menuitem', { name: 'Тёмная' })).toBeVisible()
	await expect(page.locator('html')).toHaveClass(/dark/)
})
