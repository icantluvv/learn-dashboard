import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { Button } from '../button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './dropdown-menu'

function TestDropdownMenu({ onSelect }: { onSelect: () => void }) {
	return (
		<div>
			<button type="button">Снаружи</button>

			<DropdownMenu>
				<DropdownMenuTrigger render={<Button aria-label="Открыть меню">*</Button>} />

				<DropdownMenuContent>
					<DropdownMenuItem onClick={onSelect}>Пункт</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

describe('<DropdownMenu />', () => {
	it('открывается по триггеру и показывает пункты', async () => {
		const view = await render(<TestDropdownMenu onSelect={vi.fn()} />)

		await view.getByRole('button', { name: 'Открыть меню' }).click()

		await expect.element(view.getByRole('menuitem', { name: 'Пункт' })).toBeVisible()
	})

	it('вызывает обработчик выбора пункта и закрывается', async () => {
		const onSelect = vi.fn()
		const view = await render(<TestDropdownMenu onSelect={onSelect} />)

		await view.getByRole('button', { name: 'Открыть меню' }).click()
		await view.getByRole('menuitem', { name: 'Пункт' }).click()

		expect(onSelect).toHaveBeenCalledTimes(1)
		await expect.element(view.getByRole('menuitem', { name: 'Пункт' })).not.toBeInTheDocument()
	})

	it('закрывается по Escape и возвращает фокус триггеру', async () => {
		const view = await render(<TestDropdownMenu onSelect={vi.fn()} />)

		const trigger = view.getByRole('button', { name: 'Открыть меню' })

		await trigger.click()
		await expect.element(view.getByRole('menuitem', { name: 'Пункт' })).toBeVisible()

		await userEvent.keyboard('{Escape}')

		await expect.element(view.getByRole('menuitem', { name: 'Пункт' })).not.toBeInTheDocument()
		await expect.element(trigger).toHaveFocus()
	})
})
