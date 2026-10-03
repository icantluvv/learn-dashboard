import type { CurrentUser } from '#/lib/auth/get-session'

import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '#/tests/render'

const { useGetAuthMe } = vi.hoisted(() => ({ useGetAuthMe: vi.fn() }))

vi.mock('@repo/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@repo/api')>()
	return { ...actual, useGetAuthMe }
})

const { ProfileView } = await import('./profile-view')

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
	role: 'developer',
}

describe('<ProfileView />', () => {
	it('показывает экран загрузки, пока запрос выполняется', async () => {
		useGetAuthMe.mockReturnValue({
			data: undefined,
			error: null,
			isError: false,
			isLoading: true,
		})

		const view = await renderWithProviders(<ProfileView />)

		await expect.element(view.getByText('Сергей')).not.toBeInTheDocument()
		await expect
			.element(view.getByText('Войдите в профиль, чтобы увидеть свои данные'))
			.not.toBeInTheDocument()
	})

	it('показывает гостевой экран, когда сессии нет (401)', async () => {
		useGetAuthMe.mockReturnValue({
			data: undefined,
			error: new Error('Unauthorized', { cause: { status: 401 } }),
			isError: true,
			isLoading: false,
		})

		const view = await renderWithProviders(<ProfileView />)

		await expect
			.element(view.getByText('Войдите в профиль, чтобы увидеть свои данные'))
			.toBeVisible()
		await expect
			.element(view.getByRole('link', { name: 'Войти' }))
			.toHaveAttribute('href', '/sign-in')
		await expect
			.element(view.getByRole('link', { name: 'Регистрация' }))
			.toHaveAttribute('href', '/sign-up')
	})

	it('показывает экран ошибки при сбое, не связанном с отсутствием сессии', async () => {
		useGetAuthMe.mockReturnValue({
			data: undefined,
			error: new Error('Internal Server Error', { cause: { status: 500 } }),
			isError: true,
			isLoading: false,
		})

		const view = await renderWithProviders(<ProfileView />)

		await expect
			.element(view.getByText('Не удалось загрузить профиль. Попробуйте обновить страницу.'))
			.toBeVisible()
		await expect
			.element(view.getByText('Войдите в профиль, чтобы увидеть свои данные'))
			.not.toBeInTheDocument()
	})

	it('показывает данные профиля для авторизованного пользователя', async () => {
		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })

		const view = await renderWithProviders(<ProfileView />)

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByText('user@example.com')).toBeVisible()
		await expect.element(view.getByText('Разработчик')).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()
	})

	it('показывает фамилию рядом с именем, если она задана', async () => {
		useGetAuthMe.mockReturnValue({
			data: { ...user, lastName: 'Пантелеев' },
			error: null,
			isError: false,
			isLoading: false,
		})

		const view = await renderWithProviders(<ProfileView />)

		await expect.element(view.getByText('Сергей Пантелеев')).toBeVisible()
	})

	it('показывает только имя, если фамилия не задана', async () => {
		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })

		const view = await renderWithProviders(<ProfileView />)

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByText('Сергей Пантелеев')).not.toBeInTheDocument()
	})

	it.each([
		['developer', 'Разработчик'],
		['analyst', 'Аналитик'],
		['student', 'Студент'],
		['beginner', 'Начинающий'],
	] as const)('отображает роль %s как «%s»', async (role, label) => {
		useGetAuthMe.mockReturnValue({
			data: { ...user, role },
			error: null,
			isError: false,
			isLoading: false,
		})

		const view = await renderWithProviders(<ProfileView />)

		await expect.element(view.getByText(label)).toBeVisible()
	})
})
