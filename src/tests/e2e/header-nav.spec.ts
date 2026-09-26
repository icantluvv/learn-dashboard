import { expect, test } from './fixtures'

test('навигация в шапке ведёт между главной и каталогом', async ({ page }) => {
	await page.goto('/')

	const nav = page.getByRole('navigation', { name: 'Основная навигация' }).first()

	await expect(nav.getByRole('link', { name: 'Главная' })).toHaveAttribute('aria-current', 'page')

	await nav.getByRole('link', { name: 'Каталог' }).click()

	await expect(page).toHaveURL('/catalog')
	await expect(nav.getByRole('link', { name: 'Каталог' })).toHaveAttribute('aria-current', 'page')
	await expect(nav.getByRole('link', { name: 'Главная' })).not.toHaveAttribute('aria-current')
})

test('серверная разметка содержит десктопную шапку и нижнюю навигацию', async ({ request }) => {
	const response = await request.get('/')
	const html = await response.text()

	expect(html).toContain('Основная навигация')
	expect(html).toContain('Learn Frontend — на главную')
	expect(html.match(/Основная навигация/g)).toHaveLength(2)
})
