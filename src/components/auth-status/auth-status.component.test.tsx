import type { GetAuthMe200 } from '@repo/api'
import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

const getAuthMe = vi.fn<() => Promise<GetAuthMe200>>()

vi.mock('@repo/api/base/codegen/clients/meController/getAuthMe', () => ({
	getAuthMe: async () => getAuthMe(),
}))

const { AuthStatus } = await import('./auth-status')

const user: GetAuthMe200 = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
	role: 'developer',
}

function withQueryClient(children: ReactNode) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, gcTime: 0 } },
	})

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('<AuthStatus />', () => {
	beforeEach(() => {
		getAuthMe.mockReset()
	})

	it('показывает гостю только кнопку входа', async () => {
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))

		const view = await render(withQueryClient(<AuthStatus initialUser={null} />))

		await expect
			.element(view.getByRole('link', { name: 'Войти' }))
			.toHaveAttribute('href', '/sign-in')
		await expect
			.element(view.getByRole('link', { name: 'Регистрация' }))
			.not.toBeInTheDocument()
		await expect.element(view.getByRole('button', { name: /@/ })).not.toBeInTheDocument()
	})

	it('показывает авторизованному пользователю профиль вместо входа', async () => {
		getAuthMe.mockResolvedValue(user)

		const view = await render(withQueryClient(<AuthStatus initialUser={null} />))

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByRole('link', { name: 'Войти' })).not.toBeInTheDocument()
	})

	it('показывает текстовый фолбэк, когда аватар не задан', async () => {
		getAuthMe.mockResolvedValue(user)

		const view = await render(withQueryClient(<AuthStatus initialUser={null} />))

		await expect.element(view.getByText('С', { exact: true })).toBeVisible()
	})

	it('показывает аватар, когда он задан', async () => {
		getAuthMe.mockResolvedValue({ ...user, image: 'https://example.com/a.png' })

		const view = await render(withQueryClient(<AuthStatus initialUser={null} />))

		await expect
			.element(view.getByRole('presentation'))
			.toHaveAttribute('src', 'https://example.com/a.png')
	})

	it('сразу показывает профиль, полученный на сервере, не ожидая запроса', async () => {
		getAuthMe.mockImplementation(async () => new Promise(() => {}))

		const view = await render(withQueryClient(<AuthStatus initialUser={user} />))

		await expect.element(view.getByText('Сергей')).toBeVisible()
	})

	it('сразу показывает гостевое состояние, когда сервер не нашёл сессии', async () => {
		getAuthMe.mockImplementation(async () => new Promise(() => {}))

		const view = await render(withQueryClient(<AuthStatus initialUser={null} />))

		await expect.element(view.getByRole('link', { name: 'Войти' })).toBeVisible()
	})

	it('переходит в гостевое состояние, когда сессия истекла, несмотря на кэш', async () => {
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))

		const view = await render(withQueryClient(<AuthStatus initialUser={user} />))

		await expect.element(view.getByRole('link', { name: 'Войти' })).toBeVisible()
	})

	it('не предлагает выход из аккаунта', async () => {
		getAuthMe.mockResolvedValue(user)

		const view = await render(withQueryClient(<AuthStatus initialUser={null} />))

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
	})
})
