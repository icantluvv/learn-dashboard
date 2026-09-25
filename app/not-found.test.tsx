import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import NotFound from './not-found'

describe('<NotFound />', () => {
	it('renders the heading and description', async () => {
		const view = await render(<NotFound />)

		await expect
			.element(view.getByRole('heading', { name: 'Страница не найдена' }))
			.toBeVisible()
		await expect
			.element(
				view.getByText(
					'Запрошенная страница не существует или была перемещена. Проверьте адрес или вернитесь на главную страницу.',
				),
			)
			.toBeVisible()
	})

	it('renders a link back to the home page', async () => {
		const view = await render(<NotFound />)

		const link = view.getByRole('link', { name: 'На главную' })
		await expect.element(link).toBeVisible()
		await expect.element(link).toHaveAttribute('href', '/')
	})
})
