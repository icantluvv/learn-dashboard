import { Layers } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '#/tests/render'

import { StatCard } from './stat-card'

describe('<StatCard />', () => {
	it('показывает метку и значение', async () => {
		const view = await renderWithProviders(<StatCard label="Навыков" value={97} />)

		await expect
			.element(view.getByRole('group', { name: 'Навыков' }).getByText('97', { exact: true }))
			.toBeVisible()
	})

	it('рендерит переданную иконку', async () => {
		const view = await renderWithProviders(
			<StatCard label="Навыков" value={97} icon={Layers} />,
		)

		const card = view.getByRole('group', { name: 'Навыков' })

		await expect.element(card.element().querySelector('svg')).toBeInTheDocument()
	})

	it('не рендерит прогресс-бар без переданного progress', async () => {
		const view = await renderWithProviders(<StatCard label="Навыков" value={97} />)

		await expect
			.element(view.getByRole('group', { name: 'Навыков' }).getByRole('progressbar'))
			.not.toBeInTheDocument()
	})

	it('рендерит круговой прогресс-бар с процентом выполнения', async () => {
		const view = await renderWithProviders(
			<StatCard label="Навыков" value={97} progress={{ value: 25, total: 100 }} />,
		)
		const card = view.getByRole('group', { name: 'Навыков' })

		await expect.element(card.getByRole('progressbar')).toBeVisible()
		await expect.element(card.getByText('25%')).toBeVisible()
	})
})
