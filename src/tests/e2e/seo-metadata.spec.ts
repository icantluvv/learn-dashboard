// Импорт напрямую из `brand`, а не из барреля `#/seo`: баррель тянет `urls.ts` с валидацией
// client-env, а Playwright-спеки выполняются вне окружения Next.js и переменные не загружают.
import { BRAND_NAME } from '#/seo/brand'

import { expect, test } from './fixtures'

/**
 * Читает метатеги из готового DOM: на динамических маршрутах Next.js досылает их после первичной
 * разметки. Отсутствующий тег возвращается как `null`, а не подвешивает ожидание — `robots` и
 * `canonical` присутствуют не на всех страницах, и их отсутствие само по себе является ожидаемым
 * результатом в части проверок.
 */
async function readMeta(page: import('@playwright/test').Page) {
	const attribute = async (selector: string, name: string) => {
		const locator = page.locator(selector).first()

		if ((await locator.count()) === 0) {
			return null
		}

		return locator.getAttribute(name)
	}

	return {
		title: await page.title(),
		description: await attribute('meta[name="description"]', 'content'),
		canonical: await attribute('link[rel="canonical"]', 'href'),
		robots: await attribute('meta[name="robots"]', 'content'),
	}
}

test('корневой документ объявляет язык контента', async ({ page }) => {
	await page.goto('/')

	await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
})

test('главная отдаёт собственные метаданные и открыта для индексации', async ({ page }) => {
	await page.goto('/')

	const meta = await readMeta(page)

	expect(meta.title).toContain(BRAND_NAME)
	expect(meta.description).toBeTruthy()
	expect(meta.canonical).toBe(new URL('/', page.url()).origin)
	expect(meta.robots ?? '').not.toContain('noindex')
})

test('каталог и главная не дублируют заголовок и описание', async ({ page }) => {
	await page.goto('/')
	const home = await readMeta(page)

	await page.goto('/catalog')
	const catalog = await readMeta(page)

	expect(catalog.title).not.toBe(home.title)
	expect(catalog.description).not.toBe(home.description)
	expect(catalog.title).toContain(BRAND_NAME)
	expect(catalog.canonical).toMatch(/\/catalog$/)
})

test('разные направления получают разные метаданные', async ({ page }) => {
	await page.goto('/catalog/frontend')
	const frontend = await readMeta(page)

	await page.goto('/catalog/backend')
	const backend = await readMeta(page)

	expect(frontend.title).toContain('Frontend')
	expect(backend.title).toContain('Backend')
	expect(frontend.description).not.toBe(backend.description)
	expect(frontend.canonical).toMatch(/\/catalog\/frontend$/)
})

test('фильтры в query-строке не попадают в канонический адрес', async ({ page }) => {
	await page.goto('/catalog/frontend?difficulty=1&search=test')

	const { canonical } = await readMeta(page)

	expect(canonical).not.toContain('?')
	expect(canonical).toMatch(/\/catalog\/frontend$/)
})

test('страница навыка называет навык в заголовке', async ({ page }) => {
	await page.goto('/catalog/frontend')

	// Переход по прочитанному href, а не кликом: клик зависит от гидратации и под параллельной
	// нагрузкой на dev-сервер даёт флак, тогда как проверяются здесь метаданные, а не навигация.
	const href = await page
		.getByRole('link', { name: /вопросов/ })
		.first()
		.getAttribute('href')

	expect(href).toMatch(/\/catalog\/frontend\/[^/]+$/)

	await page.goto(href ?? '/catalog/frontend')

	const meta = await readMeta(page)

	expect(meta.title).toContain(BRAND_NAME)
	expect(meta.title.replace(` — ${BRAND_NAME}`, '')).not.toHaveLength(0)
	expect(meta.description).toBeTruthy()
	expect(meta.canonical).toMatch(/\/catalog\/frontend\/[^/]+$/)
})

test('страницы входа и регистрации индексируемы и различимы', async ({ page }) => {
	await page.goto('/sign-in')
	const signIn = await readMeta(page)

	await page.goto('/sign-up')
	const signUp = await readMeta(page)

	expect(signIn.title).not.toBe(signUp.title)
	expect(signIn.robots ?? '').not.toContain('noindex')
	expect(signUp.robots ?? '').not.toContain('noindex')
})

test('профиль закрыт от индексации', async ({ page }) => {
	await page.goto('/profile')

	const { robots } = await readMeta(page)

	expect(robots).toContain('noindex')
})

test('страница 404 закрыта от индексации', async ({ page }) => {
	await page.goto('/this-route-does-not-exist')

	const { robots } = await readMeta(page)

	expect(robots).toContain('noindex')
})

test('несуществующее направление и навык отдают 404 без ошибки рендеринга', async ({ page }) => {
	for (const path of ['/catalog/unknown-core', '/catalog/frontend/missing-skill']) {
		const response = await page.goto(path)

		expect(response?.status()).toBe(404)
		await expect(page.getByTestId('error-boundary')).toBeVisible()
	}
})

test('sitemap перечисляет только существующие адреса', async ({ request }) => {
	const response = await request.get('/sitemap.xml')

	expect(response.ok()).toBe(true)

	const xml = await response.text()
	const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
		(match) => new URL(match[1]!).pathname,
	)

	expect(paths).toEqual(expect.arrayContaining(['/', '/catalog', '/sign-in', '/sign-up']))
	expect(paths).not.toContain('/profile')

	for (const path of paths) {
		const pathResponse = await request.get(path)

		expect(pathResponse.status()).not.toBe(404)
	}
})
