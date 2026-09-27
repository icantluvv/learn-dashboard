import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '#/tests/render'

const { useGetAuthMe } = vi.hoisted(() => ({ useGetAuthMe: vi.fn() }))

vi.mock('@repo/api', () => ({ useGetAuthMe }))

const { DashboardGreeting } = await import('./dashboard-greeting')

describe('<DashboardGreeting />', () => {
	it('показывает нейтральное приветствие для неавторизованного пользователя', async () => {
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<DashboardGreeting />)

		await expect.element(view.getByRole('heading', { name: 'Добро пожаловать' })).toBeVisible()
	})

	it('показывает персональное приветствие для авторизованного пользователя', async () => {
		useGetAuthMe.mockReturnValue({
			data: { id: 'u1', name: 'Анна', email: 'a@a.com', gender: 'female', age: 20 },
			isError: false,
			isPending: false,
		})

		const view = await renderWithProviders(<DashboardGreeting />)

		await expect
			.element(view.getByRole('heading', { name: 'С возвращением, Анна' }))
			.toBeVisible()
	})

	it('содержит подзаголовок-призыв к действию', async () => {
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<DashboardGreeting />)

		await expect.element(view.getByText('К чему приступим сегодня?')).toBeVisible()
	})
})
