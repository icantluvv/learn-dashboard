import type { GetSkills200 } from '@repo/api'

import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '#/tests/render'

const { useGetSkills } = vi.hoisted(() => ({ useGetSkills: vi.fn() }))

vi.mock('@repo/api', () => ({ useGetSkills }))

const { Dashboard } = await import('./dashboard')

const skills: GetSkills200 = [
	{
		id: 'js-closures',
		title: 'Замыкания в JavaScript',
		topic: 'JavaScript',
		difficulty: 'medium',
		questionsCount: 12,
	},
	{
		id: 'js-events',
		title: 'События в JavaScript',
		topic: 'JavaScript',
		difficulty: 'easy',
		questionsCount: 8,
	},
	{
		id: 'ts-generics',
		title: 'Дженерики в TypeScript',
		topic: 'TypeScript',
		difficulty: 'easy',
		questionsCount: 20,
	},
]

const errorText = 'Не удалось загрузить статистику каталога. Попробуйте обновить страницу.'
const emptyText = 'В каталоге пока нет навыков.'

describe('<Dashboard />', () => {
	it('показывает сводные показатели по непустому каталогу', async () => {
		useGetSkills.mockReturnValue({ data: skills, isError: false, isLoading: false })

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

	it('показывает распределение по сложности с русскими подписями', async () => {
		useGetSkills.mockReturnValue({ data: skills, isError: false, isLoading: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect
			.element(view.getByRole('group', { name: 'Лёгкий' }).getByText('2', { exact: true }))
			.toBeVisible()
		await expect
			.element(view.getByRole('group', { name: 'Средний' }).getByText('1', { exact: true }))
			.toBeVisible()
		await expect
			.element(view.getByRole('group', { name: 'Сложный' }).getByText('0', { exact: true }))
			.toBeVisible()
	})

	it('не показывает ошибку во время загрузки', async () => {
		useGetSkills.mockReturnValue({ data: undefined, isError: false, isLoading: true })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByText(errorText)).not.toBeInTheDocument()
		await expect.element(view.getByRole('group', { name: 'Навыков' })).not.toBeInTheDocument()
	})

	it('показывает сообщение об ошибке без значений показателей', async () => {
		useGetSkills.mockReturnValue({ data: undefined, isError: true, isLoading: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByText(errorText)).toBeVisible()
		await expect.element(view.getByRole('group', { name: 'Навыков' })).not.toBeInTheDocument()
	})

	it('показывает сообщение вместо нулей при пустом каталоге', async () => {
		useGetSkills.mockReturnValue({ data: [], isError: false, isLoading: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByText(emptyText)).toBeVisible()
		await expect.element(view.getByRole('group', { name: 'Навыков' })).not.toBeInTheDocument()
	})

	it('содержит вводный блок со ссылкой на каталог', async () => {
		useGetSkills.mockReturnValue({ data: skills, isError: false, isLoading: false })

		const view = await renderWithProviders(<Dashboard />)

		await expect.element(view.getByRole('heading', { name: 'Learn Frontend' })).toBeVisible()
		await expect
			.element(view.getByRole('link', { name: 'Перейти в каталог' }))
			.toHaveAttribute('href', '/catalog')
	})
})
