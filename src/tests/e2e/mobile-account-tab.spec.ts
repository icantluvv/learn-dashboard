import { expect, test } from './fixtures'

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
})

test('вкладка «Аккаунт» ведёт на /profile и подсвечивается активной', async ({ page }) => {
	await page.goto('/')

	const accountTab = page.getByRole('link', { name: 'Аккаунт' })
	await expect(accountTab).toHaveAttribute('href', '/profile')
	await expect(accountTab).not.toHaveAttribute('aria-current', 'page')

	await accountTab.click()
	await page.waitForURL('/profile')

	await expect(page.getByRole('link', { name: 'Аккаунт' })).toHaveAttribute(
		'aria-current',
		'page',
	)
})

test('гость на /profile видит приглашение войти и обе кнопки без общей навигации на /sign-in', async ({
	page,
}) => {
	await page.goto('/profile')

	await expect(page.getByText('Войдите в профиль, чтобы увидеть свои данные')).toBeVisible()

	const signInLink = page.getByRole('link', { name: 'Войти' })
	const signUpLink = page.getByRole('link', { name: 'Регистрация' })
	await expect(signInLink).toHaveAttribute('href', '/sign-in')
	await expect(signUpLink).toHaveAttribute('href', '/sign-up')

	await signInLink.click()
	await page.waitForURL('/sign-in')
	await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeHidden()
})
