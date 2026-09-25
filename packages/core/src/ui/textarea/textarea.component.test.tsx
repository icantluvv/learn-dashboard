import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { Textarea } from './textarea'

describe('<Textarea />', () => {
	it('сообщает введённое значение', async () => {
		const onChange = vi.fn()

		const view = await render(<Textarea aria-label="Комментарий" onChange={onChange} />)

		await view.getByRole('textbox', { name: 'Комментарий' }).fill('Текст')

		expect(onChange).toHaveBeenCalled()
	})
})
