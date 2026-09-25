import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { Input } from './input'

describe('<Input />', () => {
	it('сообщает каждое изменение значения', async () => {
		const onChange = vi.fn()

		const view = await render(
			<Input aria-label="Поиск" placeholder="Поиск" onChange={onChange} />,
		)

		await view.getByRole('textbox', { name: 'Поиск' }).fill('React')

		expect(onChange).toHaveBeenCalled()
	})

	it('показывает placeholder при пустом значении', async () => {
		const view = await render(
			<Input aria-label="Поиск" placeholder="Поиск по названию" value="" readOnly />,
		)

		await expect
			.element(view.getByRole('textbox', { name: 'Поиск' }))
			.toHaveAttribute('placeholder', 'Поиск по названию')
	})
})
