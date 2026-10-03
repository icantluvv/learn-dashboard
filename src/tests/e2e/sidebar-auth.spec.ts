import { expect, test } from './fixtures'

function uniqueEmail() {
	return `e2e-header-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
}

test('вход показывает кнопку-аватар, выход возвращает кнопку входа', async ({ page }) => {
	const email = uniqueEmail()

	await page.goto('/')
	await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible()

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

	const sidebar = page.getByRole('complementary')
	await expect(sidebar.getByText('Сергей')).toBeVisible()
	await expect(sidebar.getByText(email, { exact: true })).toBeVisible()

	await page.getByRole('button', { name: 'Выйти' }).click()

	await expect(sidebar.getByRole('link', { name: 'Войти' })).toBeVisible()
	await expect(sidebar.getByText(email, { exact: true })).toBeHidden()
})
