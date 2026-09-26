import { expect, test } from '@playwright/test'

function uniqueEmail() {
	return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
}

async function signUp(page: import('@playwright/test').Page, email: string) {
	await page.goto('/sign-up')
	await page.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
	await page.getByRole('textbox', { name: 'Email' }).fill(email)
	await page.getByLabel('Пароль').fill('12345678')
	await page.getByRole('combobox', { name: 'Пол' }).click()
	await page.getByRole('option', { name: 'Мужской' }).click()
	await page.getByRole('spinbutton', { name: 'Возраст' }).fill('28')
	await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
	await page.waitForURL('/')
	await expect(page.getByText('Сергей')).toBeVisible()
}

async function signOut(page: import('@playwright/test').Page) {
	await page.getByRole('button', { name: 'Выйти' }).click()
	await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible()
}

test('главная страница доступна гостю', async ({ page }) => {
	await page.goto('/')

	await expect(page).toHaveURL('/')
	await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible()
})

test('регистрация открывает сессию, выход её закрывает', async ({ page, request }) => {
	const email = uniqueEmail()

	await signUp(page, email)

	const me = await page.request.get('/api/me')
	expect(me.status()).toBe(200)
	expect(await me.json()).toMatchObject({ email, gender: 'male', age: 28 })

	await page.reload()
	await expect(page.getByText('Сергей')).toBeVisible()

	await signOut(page)

	const meAfterSignOut = await page.request.get('/api/me')
	expect(meAfterSignOut.status()).toBe(401)

	const meWithoutCookies = await request.get('/api/me')
	expect(meWithoutCookies.status()).toBe(401)
})

test('вход с неверным паролем показывает ошибку', async ({ page }) => {
	const email = uniqueEmail()

	await signUp(page, email)
	await signOut(page)

	await page.goto('/sign-in')
	await page.getByRole('textbox', { name: 'Email' }).fill(email)
	await page.getByLabel('Пароль').fill('wrong-password')
	await page.getByRole('button', { name: 'Войти' }).click()

	await expect(page.getByText('Неверный email или пароль')).toBeVisible()
	await expect(page).toHaveURL(/\/sign-in$/)
})

test('авторизованный пользователь не видит страницы входа и регистрации', async ({ page }) => {
	await signUp(page, uniqueEmail())

	await page.goto('/sign-in')
	await expect(page).toHaveURL('/')

	await page.goto('/sign-up')
	await expect(page).toHaveURL('/')
})

test('подделанная сессионная cookie не даёт доступа', async ({ context, page }) => {
	await context.addCookies([
		{
			name: 'better-auth.session_token',
			value: 'forged-value',
			url: page.url() === 'about:blank' ? 'http://localhost:3000' : page.url(),
		},
	])

	await page.goto('/')

	const me = await page.request.get('/api/me')
	expect(me.status()).toBe(401)
	await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible()
})
