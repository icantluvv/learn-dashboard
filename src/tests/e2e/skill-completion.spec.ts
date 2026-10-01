import type { Page } from '@playwright/test'

import { expect, test } from './fixtures'

function uniqueEmail() {
	return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
}

async function hideDevIndicator(page: Page) {
	await page.addInitScript(() => {
		const style = document.createElement('style')
		style.textContent = 'nextjs-portal { display: none !important; }'
		document.head.append(style)
	})
}

async function signUp(page: Page, email: string) {
	await page.goto('/sign-up')
	await page.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
	await page.getByRole('textbox', { name: 'Email' }).fill(email)
	await page.getByLabel('Пароль').fill('12345678')
	await page.getByRole('combobox', { name: 'Пол' }).click()
	await page.getByRole('option', { name: 'Мужской' }).click()
	await page.getByRole('spinbutton', { name: 'Возраст' }).fill('28')
	await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
	await page.waitForURL('/')

	const me = await page.request.get('/api/me')
	expect(me.status()).toBe(200)
}

async function openFirstSkill(page: Page) {
	await page.goto('/catalog/frontend')
	await page
		.getByRole('link', { name: /вопросов/ })
		.first()
		.click()
	await expect(page).toHaveURL(/\/catalog\/frontend\/[^/]+$/)

	return page.url()
}

const completionButton = (page: Page) => page.getByRole('button', { name: 'Изучен' })

test('авторизованный пользователь отмечает навык изученным и снимает отметку', async ({ page }) => {
	await signUp(page, uniqueEmail())

	const skillUrl = await openFirstSkill(page)

	await expect(completionButton(page)).toHaveAttribute('aria-pressed', 'false')

	await completionButton(page).click()
	await expect(completionButton(page)).toHaveAttribute('aria-pressed', 'true')

	// Отметка должна пережить перезагрузку: она хранится на сервере, а не в состоянии компонента.
	await page.reload()
	await expect(completionButton(page)).toHaveAttribute('aria-pressed', 'true')

	const stats = await page.request.get('/api/dashboard-stats')
	expect(await stats.json()).toMatchObject({ completedSkillsCount: 1 })

	await page.goto('/')
	await expect(page.getByText('1', { exact: false }).first()).toBeVisible()

	await page.goto(skillUrl)
	await completionButton(page).click()
	await expect(completionButton(page)).toHaveAttribute('aria-pressed', 'false')

	await page.reload()
	await expect(completionButton(page)).toHaveAttribute('aria-pressed', 'false')

	const statsAfterUndo = await page.request.get('/api/dashboard-stats')
	expect(await statsAfterUndo.json()).toMatchObject({ completedSkillsCount: 0 })
})

test('гость уходит на вход и возвращается на страницу навыка', async ({ browser, page }) => {
	const email = uniqueEmail()

	// Аккаунт создаётся в отдельном browser-контексте: его cookie не попадают в основной,
	// поэтому страница остаётся гостевой и выход через интерфейс не нужен. HTTP-регистрация в этом
	// приложении намеренно отключена (`/api/auth/sign-up/email` отдаёт 404), так что аккаунт
	// создаётся через форму.
	const setupContext = await browser.newContext()
	const setupPage = await setupContext.newPage()
	await hideDevIndicator(setupPage)
	await signUp(setupPage, email)
	await setupContext.close()

	const skillUrl = await openFirstSkill(page)
	const skillPath = new URL(skillUrl).pathname

	await page.getByRole('link', { name: 'Изучен' }).click()

	await expect(page).toHaveURL(`/sign-in?next=${encodeURIComponent(skillPath)}`)

	await page.getByRole('textbox', { name: 'Email' }).fill(email)
	await page.getByLabel('Пароль').fill('12345678')
	await page.getByRole('button', { name: 'Войти' }).click()

	// Возврат на тот же навык, и отметка не проставлена автоматически.
	await page.waitForURL(skillPath)
	await expect(completionButton(page)).toHaveAttribute('aria-pressed', 'false')
})
