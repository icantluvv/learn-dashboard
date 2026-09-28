import { expect, test } from './fixtures'

test('витрина /catalog показывает баннеры направлений вместо карточек', async ({ page }) => {
	await page.goto('/catalog')

	await expect(page).toHaveURL('/catalog')
	await expect(page.locator('a[href="/catalog/frontend"]')).toBeVisible()
	await expect(page.locator('a[href="/catalog/backend"]')).toBeVisible()
	await expect(page.getByRole('link', { name: /вопросов/ })).toHaveCount(0)
})

test('баннер «Frontend» ведёт в раздел с карточками навыков', async ({ page }) => {
	await page.goto('/catalog')

	await page.locator('a[href="/catalog/frontend"]').click()

	await expect(page).toHaveURL('/catalog/frontend')
	await expect(page.getByRole('link', { name: /вопросов/ }).first()).toBeVisible()
})

test('карточка ведёт на страницу навыка внутри своего направления', async ({ page }) => {
	await page.goto('/catalog/frontend')

	const card = page.getByRole('link', { name: /вопросов/ }).first()
	await card.click()

	await expect(page).toHaveURL(/\/catalog\/frontend\/[^/]+$/)
	await expect(page.getByRole('button', { name: 'Назад' })).toBeVisible()
})

test('главная не содержит сетку карточек каталога', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('link', { name: /вопросов/ })).toHaveCount(0)

	await page.getByRole('link', { name: 'Каталог' }).click()

	await expect(page).toHaveURL('/catalog')
	await expect(page.getByRole('link', { name: /Frontend/ })).toBeVisible()
})

test('фильтр попадает в query-параметры раздела и переживает перезагрузку', async ({ page }) => {
	await page.goto('/catalog/frontend')

	const search = page.getByRole('textbox', { name: 'Поиск по названию' })
	await search.fill('java')

	await page.waitForURL(/\/catalog\/frontend\?.*search=java/)

	await page.reload()

	await expect(page).toHaveURL(/\/catalog\/frontend\?.*search=java/)
	await expect(page.getByRole('textbox', { name: 'Поиск по названию' })).toHaveValue('java')
})

test('сброс фильтров оставляет пользователя в разделе направления', async ({ page }) => {
	await page.goto('/catalog/frontend?search=java')

	await page.getByRole('button', { name: 'Сбросить фильтры' }).click()

	await expect(page).toHaveURL('/catalog/frontend')
	await expect(page.getByRole('link', { name: /вопросов/ }).first()).toBeVisible()
})

test('раздел без навыков показывает заглушку «Раздел в разработке»', async ({ page }) => {
	await page.goto('/catalog/backend')

	await expect(page.getByRole('heading', { name: 'Раздел в разработке' })).toBeVisible()
	await expect(page.getByRole('link', { name: /вопросов/ })).toHaveCount(0)
	await expect(page.getByRole('textbox', { name: 'Поиск по названию' })).toHaveCount(0)
})

test('неизвестное направление даёт страницу «не найдено»', async ({ page }) => {
	const response = await page.goto('/catalog/mobile')

	expect(response?.status()).toBe(404)
})

test('навык, открытый под чужим направлением, даёт страницу «не найдено»', async ({ page }) => {
	await page.goto('/catalog/frontend')

	const href = await page
		.getByRole('link', { name: /вопросов/ })
		.first()
		.getAttribute('href')
	const skillId = href?.split('/').pop() ?? ''

	expect(skillId).not.toBe('')

	const response = await page.goto(`/catalog/backend/${skillId}`)

	expect(response?.status()).toBe(404)
})

test('гидратация раздела не делает повторный запрос списка навыков', async ({ page }) => {
	const skillsRequests: string[] = []

	page.on('request', (request) => {
		if (new URL(request.url()).pathname.endsWith('/api/skills')) {
			skillsRequests.push(request.url())
		}
	})

	await page.goto('/catalog/frontend')
	await expect(page.getByRole('link', { name: /вопросов/ }).first()).toBeVisible()

	expect(skillsRequests).toHaveLength(0)
})

test('заглушка раздела не запрашивает список навыков', async ({ page }) => {
	const skillsRequests: string[] = []

	page.on('request', (request) => {
		if (new URL(request.url()).pathname.endsWith('/api/skills')) {
			skillsRequests.push(request.url())
		}
	})

	await page.goto('/catalog/backend')
	await expect(page.getByRole('heading', { name: 'Раздел в разработке' })).toBeVisible()

	expect(skillsRequests).toHaveLength(0)
})
