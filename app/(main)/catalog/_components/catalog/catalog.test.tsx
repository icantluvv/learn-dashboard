import type { GetSkills200 } from '@repo/api'

import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '#/tests/render'

const { useGetSkills } = vi.hoisted(() => ({ useGetSkills: vi.fn() }))

vi.mock('@repo/api', () => ({ useGetSkills }))

const { Catalog } = await import('./catalog')

const skills: GetSkills200 = [
	{
		id: 'js-closures',
		title: 'Замыкания в JavaScript',
		topic: 'JavaScript',
		difficulty: 'medium',
		questionsCount: 12,
	},
]

const errorText = 'Не удалось загрузить список навыков. Попробуйте обновить страницу.'
const emptyText = 'Скиллов по запросу не нашлось.'

describe('<Catalog />', () => {
	it('does not render the error or empty state while loading', async () => {
		useGetSkills.mockReturnValue({ data: undefined, isError: false, isLoading: true })

		const view = await renderWithProviders(<Catalog />)

		await expect.element(view.getByText(errorText)).not.toBeInTheDocument()
		await expect.element(view.getByText(emptyText)).not.toBeInTheDocument()
	})

	it('renders the error state when the query fails', async () => {
		useGetSkills.mockReturnValue({ data: undefined, isError: true, isLoading: false })

		const view = await renderWithProviders(<Catalog />)

		await expect.element(view.getByText(errorText)).toBeVisible()
	})

	it('renders the empty state when the query resolves with no skills', async () => {
		useGetSkills.mockReturnValue({ data: [], isError: false, isLoading: false })

		const view = await renderWithProviders(<Catalog />)

		await expect.element(view.getByText(emptyText)).toBeVisible()
	})

	it('renders a card for every returned skill', async () => {
		useGetSkills.mockReturnValue({ data: skills, isError: false, isLoading: false })

		const view = await renderWithProviders(<Catalog />)

		await expect.element(view.getByText('Замыкания в JavaScript')).toBeVisible()
		await expect.element(view.getByText('12 вопросов')).toBeVisible()
	})
})
