import { expect, test } from './fixtures'

test('навигация в Sidebar ведёт между главной и каталогом', async ({ page }) => {
	await page.goto('/')

	const nav = page.getByRole('navigation', { name: 'Основная навигация' }).first()

	await expect(nav.getByRole('link', { name: 'Главная' })).toHaveAttribute('aria-current', 'page')

	await nav.getByRole('link', { name: 'Каталог' }).click()

	await expect(page).toHaveURL('/catalog')
	await expect(nav.getByRole('link', { name: 'Каталог' })).toHaveAttribute('aria-current', 'page')
	await expect(nav.getByRole('link', { name: 'Главная' })).not.toHaveAttribute('aria-current')
})

test('серверная разметка содержит десктопный Sidebar и нижнюю навигацию, но не Header', async ({
	request,
}) => {
	const response = await request.get('/')
	const html = await response.text()

	expect(html).toContain('Основная навигация')
	expect(html).toContain('Learn Frontend — на главную')
	expect(html.match(/Основная навигация/g)).toHaveLength(2)
	expect(html).not.toContain('<header')
})

test('Sidebar занимает пропорцию 1:5 к контенту на lg+', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 })
	await page.goto('/')

	const sidebar = page.locator('aside').first()
	const sidebarBox = await sidebar.boundingBox()

	expect(sidebarBox).not.toBeNull()

	if (sidebarBox != null) {
		const viewport = page.viewportSize()
		expect(viewport).not.toBeNull()

		if (viewport != null) {
			const contentWidth = viewport.width - sidebarBox.width
			const ratio = contentWidth / sidebarBox.width

			expect(ratio).toBeGreaterThan(4.5)
			expect(ratio).toBeLessThan(5.5)
		}
	}
})
