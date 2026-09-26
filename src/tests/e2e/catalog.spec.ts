import { expect, test } from './fixtures'

test('каталог доступен по /catalog и показывает карточки навыков', async ({ page }) => {
	await page.goto('/catalog')

	await expect(page).toHaveURL('/catalog')
	await expect(page.getByRole('link', { name: /вопросов/ }).first()).toBeVisible()
})

test('главная не содержит сетку карточек и ведёт в каталог', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('link', { name: /вопросов/ })).toHaveCount(0)

	await page.getByRole('link', { name: 'Перейти в каталог' }).click()

	await expect(page).toHaveURL('/catalog')
	await expect(page.getByRole('link', { name: /вопросов/ }).first()).toBeVisible()
})

test('фильтр попадает в query-параметры /catalog и переживает перезагрузку', async ({ page }) => {
	await page.goto('/catalog')

	const search = page.getByRole('textbox', { name: 'Поиск по названию' })
	await search.fill('java')

	await page.waitForURL(/\/catalog\?.*search=java/)

	await page.reload()

	await expect(page).toHaveURL(/search=java/)
	await expect(page.getByRole('textbox', { name: 'Поиск по названию' })).toHaveValue('java')
})

test('параметры фильтров на главной не влияют на содержимое', async ({ page }) => {
	await page.goto('/?search=java')

	await expect(page.getByRole('link', { name: /вопросов/ })).toHaveCount(0)
	await expect(page.getByRole('heading', { name: 'Learn Frontend' })).toBeVisible()
})

test('гидратация /catalog не делает повторный запрос списка навыков', async ({ page }) => {
	const skillsRequests: string[] = []

	page.on('request', (request) => {
		if (new URL(request.url()).pathname.endsWith('/api/skills')) {
			skillsRequests.push(request.url())
		}
	})

	await page.goto('/catalog')
	await expect(page.getByRole('link', { name: /вопросов/ }).first()).toBeVisible()

	expect(skillsRequests).toHaveLength(0)
})
