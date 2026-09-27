import type { GetDashboardStats200 } from '@repo/api'

import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '#/tests/render'

const { useGetAuthMe, useGetDashboardStats } = vi.hoisted(() => ({
	useGetAuthMe: vi.fn(),
	useGetDashboardStats: vi.fn(),
}))

vi.mock('@repo/api', () => ({ useGetDashboardStats, useGetAuthMe }))

const { Dashboard } = await import('./dashboard')

const stats: GetDashboardStats200 = {
	skillsCount: 3,
	topicsCount: 2,
	questionsCount: 40,
}

const errorText = 'Не удалось загрузить статистику каталога. Попробуйте обновить страницу.'
const emptyText = 'В каталоге пока нет навыков.'

describe('<Dashboard />', () => {
	it('показывает сводные показатели по непустому каталогу', async () => {
		useGetDashboardStats.mockReturnValue({ data: stats, isError: false, isLoading: false })
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect
			.element(view.getByRole('group', { name: 'Навыков' }).getByText('3', { exact: true }))
			.toBeVisible()
		await expect
			.element(view.getByRole('group', { name: 'Тем' }).getByText('2', { exact: true }))
			.toBeVisible()
		await expect
			.element(view.getByRole('group', { name: 'Вопросов' }).getByText('40', { exact: true }))
			.toBeVisible()
	})

	it('не показывает карточки распределения по сложности', async () => {
		useGetDashboardStats.mockReturnValue({ data: stats, isError: false, isLoading: false })
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByRole('group', { name: 'Лёгкий' })).not.toBeInTheDocument()
		await expect.element(view.getByRole('group', { name: 'Средний' })).not.toBeInTheDocument()
		await expect.element(view.getByRole('group', { name: 'Сложный' })).not.toBeInTheDocument()
	})

	it('не показывает ошибку во время загрузки', async () => {
		useGetDashboardStats.mockReturnValue({ data: undefined, isError: false, isLoading: true })
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByText(errorText)).not.toBeInTheDocument()
		await expect.element(view.getByRole('group', { name: 'Навыков' })).not.toBeInTheDocument()
	})

	it('показывает сообщение об ошибке без значений показателей', async () => {
		useGetDashboardStats.mockReturnValue({ data: undefined, isError: true, isLoading: false })
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByText(errorText)).toBeVisible()
		await expect.element(view.getByRole('group', { name: 'Навыков' })).not.toBeInTheDocument()
	})

	it('показывает сообщение вместо нулей при пустом каталоге', async () => {
		useGetDashboardStats.mockReturnValue({
			data: { skillsCount: 0, topicsCount: 0, questionsCount: 0 },
			isError: false,
			isLoading: false,
		})
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByText(emptyText)).toBeVisible()
		await expect.element(view.getByRole('group', { name: 'Навыков' })).not.toBeInTheDocument()
	})

	it('не показывает прогресс-бар для неавторизованного пользователя', async () => {
		useGetDashboardStats.mockReturnValue({ data: stats, isError: false, isLoading: false })
		useGetAuthMe.mockReturnValue({ data: null, isError: true, isPending: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect
			.element(view.getByRole('group', { name: 'Навыков' }).getByRole('progressbar'))
			.not.toBeInTheDocument()
	})

	it('показывает прогресс-бар для авторизованного пользователя', async () => {
		useGetDashboardStats.mockReturnValue({
			data: { ...stats, completedSkillsCount: 1 },
			isError: false,
			isLoading: false,
		})
		useGetAuthMe.mockReturnValue({
			data: { id: 'u1', name: 'Анна', email: 'a@a.com', gender: 'female', age: 20 },
			isError: false,
			isPending: false,
		})

		const view = await renderWithProviders(<Dashboard />)

		await expect
			.element(view.getByRole('group', { name: 'Навыков' }).getByRole('progressbar'))
			.toBeVisible()
	})
})
