import type { GetAuthMe200 } from '@repo/api'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetNextNavigationMock } from '#/tests/mocks/next-navigation'
import { renderWithProviders } from '#/tests/render'

const getAuthMe = vi.fn<() => Promise<GetAuthMe200>>()
const signOut = vi.fn(async () => {})

vi.mock('@repo/api/base/codegen/clients/meController/getAuthMe', () => ({
	getAuthMe: async () => getAuthMe(),
}))

vi.mock('#/lib/auth/client', () => ({
	authClient: { signOut: async () => signOut() },
}))

const { AccountDrawer } = await import('./account-drawer')

const user: GetAuthMe200 = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
}

describe('<AccountDrawer />', () => {
	beforeEach(() => {
		resetNextNavigationMock()
		signOut.mockClear()
	})

	it('гостю показывает кнопку входа', async () => {
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))

		const view = await renderWithProviders(<AccountDrawer />)

		await view.getByRole('button', { name: 'Меню' }).click()

		await expect
			.element(view.getByRole('link', { name: 'Войти' }))
			.toHaveAttribute('href', '/sign-in')
		await expect.element(view.getByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
	})

	it('авторизованному пользователю показывает профиль и кнопку выхода', async () => {
		getAuthMe.mockResolvedValue(user)

		const view = await renderWithProviders(<AccountDrawer />)

		await view.getByRole('button', { name: 'Меню' }).click()

		await expect.element(view.getByText('Сергей', { exact: true })).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()
		await expect.element(view.getByRole('link', { name: 'Войти' })).not.toBeInTheDocument()
	})

	it('показывает переключатель темы', async () => {
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))

		const view = await renderWithProviders(<AccountDrawer />)

		await view.getByRole('button', { name: 'Меню' }).click()

		await expect.element(view.getByRole('button', { name: 'Переключить тему' })).toBeVisible()
	})

	it('выполняет выход из аккаунта', async () => {
		getAuthMe.mockResolvedValue(user)

		const view = await renderWithProviders(<AccountDrawer />)

		await view.getByRole('button', { name: 'Меню' }).click()
		await view.getByRole('button', { name: 'Выйти' }).click()

		await vi.waitFor(() => {
			expect(signOut).toHaveBeenCalledTimes(1)
		})
	})
})
