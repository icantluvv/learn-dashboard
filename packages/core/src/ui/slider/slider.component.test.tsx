import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { Slider } from './slider'

describe('<Slider />', () => {
	it('рендерит по одному thumb на каждое значение диапазона', async () => {
		const view = await render(
			<Slider aria-label="Количество вопросов" defaultValue={[0, 25]} min={0} max={25} />,
		)

		await expect.element(view.getByRole('slider').first()).toBeVisible()
		expect(view.container.querySelectorAll('[data-slot="slider-thumb"]')).toHaveLength(2)
	})

	it('двигает активный thumb с клавиатуры, не выходя за границы', async () => {
		const onValueCommitted = vi.fn()

		const view = await render(
			<Slider
				aria-label="Количество вопросов"
				defaultValue={[0, 25]}
				min={0}
				max={25}
				onValueCommitted={onValueCommitted}
			/>,
		)

		const thumb = view.getByRole('slider').first()
		const input = thumb.element() as HTMLInputElement

		input.focus()
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))

		await expect.element(thumb).toHaveAttribute('aria-valuenow', '0')
	})
})
