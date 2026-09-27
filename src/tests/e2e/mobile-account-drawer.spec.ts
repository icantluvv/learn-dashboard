import { expect, test } from './fixtures'

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
})

test('кнопка «Меню» открывает AccountDrawer во весь экран поверх нижней навигации', async ({
	page,
}) => {
	await page.goto('/')

	const bottomNav = page.getByRole('navigation', { name: 'Основная навигация' })
	const accountButton = bottomNav.getByRole('button', { name: 'Меню' })

	await expect(accountButton).not.toHaveAttribute('href')
	await accountButton.click()

	const drawer = page.getByRole('dialog').or(page.locator('[data-slot="drawer-popup"]'))
	await expect(drawer).toBeVisible()

	const box = await drawer.boundingBox()
	const viewport = page.viewportSize()

	expect(box).not.toBeNull()

	if (box != null && viewport != null) {
		expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1)
		expect(box.height).toBeGreaterThanOrEqual(viewport.height - 1)
	}

	// URL не меняется — открытие Drawer не является навигацией.
	await expect(page).toHaveURL('/')
})

test('гость видит в Drawer логотип, кнопку входа и переключатель темы', async ({ page }) => {
	await page.goto('/')

	await page
		.getByRole('navigation', { name: 'Основная навигация' })
		.getByRole('button', { name: 'Меню' })
		.click()

	await expect(page.getByRole('link', { name: /Learn Frontend/ })).toBeVisible()

	const signInLink = page.getByRole('link', { name: 'Войти' })
	await expect(signInLink).toHaveAttribute('href', '/sign-in')
	await expect(page.getByRole('button', { name: 'Переключить тему' })).toBeVisible()

	await signInLink.click()
	await page.waitForURL('/sign-in')
})
