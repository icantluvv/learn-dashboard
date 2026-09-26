import type { ReactNode } from 'react'

import type { CurrentUser } from '#/lib/auth/get-session'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

const getAuthMe = vi.fn<() => Promise<CurrentUser>>()

vi.mock('@repo/api/base/codegen/clients/meController/getAuthMe', () => ({
	getAuthMe: async () => getAuthMe(),
}))

vi.mock('#/lib/auth/client', () => ({
	authClient: { signOut: async () => {} },
}))

const { ProfileTab } = await import('./profile-tab')

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
}

function withQueryClient(children: ReactNode) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, gcTime: 0 } },
	})

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('<ProfileTab />', () => {
	beforeEach(() => {
		getAuthMe.mockReset()
	})

	it('ведёт гостя на страницу входа', async () => {
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))

		const view = await render(withQueryClient(<ProfileTab initialUser={null} />))

		await expect
			.element(view.getByRole('link', { name: 'Войти' }))
			.toHaveAttribute('href', '/sign-in')
	})

	it('показывает авторизованному кружок профиля с подписью', async () => {
		getAuthMe.mockImplementation(async () => new Promise(() => {}))

		const view = await render(withQueryClient(<ProfileTab initialUser={user} />))

		await expect.element(view.getByRole('button', { name: 'Профиль: Сергей' })).toBeVisible()
		await expect.element(view.getByText('Профиль')).toBeVisible()
	})

	it('возвращает гостевое состояние, когда сессия истекла', async () => {
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))

		const view = await render(withQueryClient(<ProfileTab initialUser={user} />))

		await expect.element(view.getByRole('link', { name: 'Войти' })).toBeVisible()
	})
})
