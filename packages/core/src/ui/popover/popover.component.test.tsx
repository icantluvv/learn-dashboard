import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { Button } from '../button'
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from './popover'

function TestPopover() {
	return (
		<div>
			<button type="button">Снаружи</button>

			<Popover>
				<PopoverTrigger render={<Button aria-label="Открыть профиль">*</Button>} />

				<PopoverContent>
					<PopoverTitle>Профиль</PopoverTitle>
					<Button>Выйти</Button>
				</PopoverContent>
			</Popover>
		</div>
	)
}

describe('<Popover />', () => {
	it('открывается по триггеру и показывает содержимое', async () => {
		const view = await render(<TestPopover />)

		await view.getByRole('button', { name: 'Открыть профиль' }).click()

		await expect.element(view.getByText('Профиль', { exact: true })).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()
	})

	it('закрывается по Escape и возвращает фокус триггеру', async () => {
		const view = await render(<TestPopover />)

		const trigger = view.getByRole('button', { name: 'Открыть профиль' })

		await trigger.click()
		await expect.element(view.getByText('Профиль', { exact: true })).toBeVisible()

		await userEvent.keyboard('{Escape}')

		await expect.element(view.getByText('Профиль', { exact: true })).not.toBeInTheDocument()
		await expect.element(trigger).toHaveFocus()
	})

	it('закрывается по клику вне попапа', async () => {
		const view = await render(<TestPopover />)

		await view.getByRole('button', { name: 'Открыть профиль' }).click()
		await expect.element(view.getByText('Профиль', { exact: true })).toBeVisible()

		await view.getByRole('button', { name: 'Снаружи' }).click()

		await expect.element(view.getByText('Профиль', { exact: true })).not.toBeInTheDocument()
	})

	it('icon-only триггер имеет доступное имя', async () => {
		const view = await render(<TestPopover />)

		await expect
			.element(view.getByRole('button', { name: 'Открыть профиль' }))
			.toHaveAttribute('aria-label', 'Открыть профиль')
	})
})
