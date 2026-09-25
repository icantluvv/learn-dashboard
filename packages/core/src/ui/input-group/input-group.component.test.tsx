import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group'

describe('<InputGroup />', () => {
	it('оставляет кнопку очистки доступной по имени и вызывает её обработчик', async () => {
		const onClear = vi.fn()

		const view = await render(
			<InputGroup>
				<InputGroupInput aria-label="Поиск" value="React" readOnly />
				<InputGroupAddon align="inline-end">
					<InputGroupButton aria-label="Очистить поиск" onClick={onClear}>
						<svg aria-hidden="true" />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>,
		)

		await view.getByRole('button', { name: 'Очистить поиск' }).click()

		expect(onClear).toHaveBeenCalledTimes(1)
	})

	it('переводит фокус в input по клику на addon', async () => {
		const view = await render(
			<InputGroup>
				<InputGroupAddon data-testid="addon">
					<svg aria-hidden="true" />
				</InputGroupAddon>
				<InputGroupInput aria-label="Поиск" />
			</InputGroup>,
		)

		await view.getByTestId('addon').click()

		await expect.element(view.getByRole('textbox', { name: 'Поиск' })).toHaveFocus()
	})
})
