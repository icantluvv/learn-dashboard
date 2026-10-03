import { expect, test } from './fixtures'

function uniqueEmail() {
	return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
}

const avatarPng = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
	'base64',
)

async function signUp(page: import('@playwright/test').Page, email: string) {
	await page.goto('/sign-up')
	await page.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
	await page.getByRole('textbox', { name: 'Email' }).fill(email)
	await page.getByLabel('Пароль').fill('12345678')
	await page.getByRole('combobox', { name: 'Пол' }).click()
	await page.getByRole('option', { name: 'Мужской' }).click()
	await page.getByRole('spinbutton', { name: 'Возраст' }).fill('28')
	await page.getByRole('combobox', { name: 'Кем вы являетесь' }).click()
	await page.getByRole('option', { name: 'Разработчик' }).click()
	await page.getByRole('button', { name: 'Зарегистрироваться' }).click()
	await page.waitForURL('/profile')
}

test('авторизованный пользователь заменяет фото профиля через реальный file picker', async ({
	page,
}) => {
	await signUp(page, uniqueEmail())

	await page.getByLabel('Изменить фото профиля').setInputFiles({
		name: 'avatar.png',
		mimeType: 'image/png',
		buffer: avatarPng,
	})

	const avatarImage = page.locator('label img[src*="/api/avatars/"]')
	await expect(avatarImage).toBeVisible({ timeout: 15_000 })

	const me = await page.request.get('/api/me')
	const profile = (await me.json()) as { image?: string }
	expect(profile.image).toMatch(/\/api\/avatars\/[0-9a-f-]+$/)
	const avatarPath = new URL(profile.image ?? '', 'http://localhost').pathname
	await expect(avatarImage).toHaveAttribute('src', avatarPath)

	await page.reload()
	await expect(page.locator('label img[src*="/api/avatars/"]')).toBeVisible()
})

test('недопустимый файл отклоняется и не меняет текущий аватар', async ({ page }) => {
	await signUp(page, uniqueEmail())

	await page.getByLabel('Изменить фото профиля').setInputFiles({
		name: 'avatar.gif',
		mimeType: 'image/gif',
		buffer: Buffer.from('not used'),
	})

	await expect(page.getByText('Выберите изображение в формате JPEG, PNG или WebP')).toBeVisible()

	const me = await page.request.get('/api/me')
	const profile = (await me.json()) as { image?: string }
	expect(profile.image).toBeUndefined()
})
