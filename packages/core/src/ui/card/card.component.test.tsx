import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { Card, CardContent, CardTitle } from './card'

describe('<Card />', () => {
	it('рендерит вложенный контент', async () => {
		const view = await render(
			<Card>
				<CardContent>
					<CardTitle>Atomic Design</CardTitle>
				</CardContent>
			</Card>,
		)

		await expect.element(view.getByText('Atomic Design')).toBeVisible()
	})

	it('прокидывает className на корневой элемент', async () => {
		const view = await render(<Card className="border-shaded">Содержимое</Card>)

		await expect.element(view.getByText('Содержимое')).toHaveClass('border-shaded')
	})
})
