import type { GetCores200 } from '@repo/api'

import * as allure from 'allure-js-commons'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '#/tests/render'

const { useGetCores } = vi.hoisted(() => ({ useGetCores: vi.fn() }))

vi.mock('@repo/api', () => ({ useGetCores }))

const { CoreBanners } = await import('./core-banners')

const IN_DEVELOPMENT_LABEL = 'Раздел в разработке'
const ERROR_MESSAGE = 'Не удалось загрузить направления. Попробуйте обновить страницу.'
const EMPTY_MESSAGE = 'Направления пока не добавлены.'

const cores: GetCores200 = [
	{
		type: 'frontend',
		name: 'Frontend from database',
		description: 'Frontend database description',
		icon: 'code',
		isAvailable: true,
	},
	{
		type: 'backend',
		name: 'Backend from database',
		description: 'Backend database description',
		icon: 'server',
		isAvailable: false,
	},
]

describe('<CoreBanners />', () => {
	it('renders a loading state while requesting cores', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'load catalog cores' },
			{ name: 'severity', value: 'normal' },
		)
		useGetCores.mockReturnValue({ data: undefined, isError: false, isLoading: true })

		const view = await renderWithProviders(<CoreBanners />)

		await expect.element(view.getByLabelText('Загружаем направления')).toBeVisible()
		expect(view.getByRole('link').all()).toHaveLength(0)
	})

	it('renders an error when the request fails', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'catalog core request error' },
			{ name: 'severity', value: 'critical' },
		)
		useGetCores.mockReturnValue({ data: undefined, isError: true, isLoading: false })

		const view = await renderWithProviders(<CoreBanners />)

		await expect.element(view.getByText(ERROR_MESSAGE)).toBeVisible()
	})

	it('renders an empty state when no cores exist', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'empty catalog core list' },
			{ name: 'severity', value: 'normal' },
		)
		useGetCores.mockReturnValue({ data: [], isError: false, isLoading: false })

		const view = await renderWithProviders(<CoreBanners />)

		await expect.element(view.getByText(EMPTY_MESSAGE)).toBeVisible()
	})

	it('renders the cores returned by the database', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'render catalog cores from database' },
			{ name: 'severity', value: 'critical' },
		)
		useGetCores.mockReturnValue({ data: cores, isError: false, isLoading: false })

		const view = await renderWithProviders(<CoreBanners />)

		await expect.element(view.getByText('Frontend from database')).toBeVisible()
		expect(view.getByRole('link').all()).toHaveLength(cores.length)
	})

	it.each(cores)('links the $type banner to its section', async (core) => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'build catalog core link from type' },
			{ name: 'severity', value: 'critical' },
		)
		useGetCores.mockReturnValue({ data: cores, isError: false, isLoading: false })

		const view = await renderWithProviders(<CoreBanners />)

		await expect
			.element(view.getByRole('link', { name: new RegExp(core.name) }))
			.toHaveAttribute('href', `/catalog/${core.type}`)
	})

	it('marks only unavailable cores as in development', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'mark unavailable catalog cores' },
			{ name: 'severity', value: 'normal' },
		)
		useGetCores.mockReturnValue({ data: cores, isError: false, isLoading: false })

		const view = await renderWithProviders(<CoreBanners />)

		expect(view.getByText(IN_DEVELOPMENT_LABEL).all()).toHaveLength(1)
		await expect
			.element(view.getByRole('link', { name: /Frontend from database/ }))
			.not.toHaveTextContent(IN_DEVELOPMENT_LABEL)
	})
})
