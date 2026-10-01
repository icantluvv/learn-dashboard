import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { Button } from '../button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

function TestTooltip({ onClick }: { onClick?: () => void } = {}) {
	return (
		<div>
			<button type="button">Снаружи</button>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button aria-label="Копировать вопрос" onClick={onClick}>
							*
						</Button>
					}
				/>

				<TooltipContent>копировать вопрос</TooltipContent>
			</Tooltip>
		</div>
	)
}

describe('<Tooltip />', () => {
	it('показывает подсказку при наведении на триггер', async () => {
		const view = await render(<TestTooltip />)

		await userEvent.hover(view.getByRole('button', { name: 'Копировать вопрос' }))

		await expect.element(view.getByText('копировать вопрос')).toBeVisible()
	})

	it('показывает подсказку при получении фокуса с клавиатуры', async () => {
		const view = await render(<TestTooltip />)

		await userEvent.keyboard('{Tab}{Tab}')

		await expect.element(view.getByRole('button', { name: 'Копировать вопрос' })).toHaveFocus()
		await expect.element(view.getByText('копировать вопрос')).toBeVisible()
	})

	it('скрывает подсказку, когда курсор уходит с триггера', async () => {
		const view = await render(<TestTooltip />)
		const trigger = view.getByRole('button', { name: 'Копировать вопрос' })

		await userEvent.hover(trigger)
		await expect.element(view.getByText('копировать вопрос')).toBeVisible()

		await userEvent.unhover(trigger)

		await expect.element(view.getByText('копировать вопрос')).not.toBeInTheDocument()
	})

	it('не перехватывает нажатие: триггер сохраняет своё действие', async () => {
		const onClick = vi.fn()
		const view = await render(<TestTooltip onClick={onClick} />)

		await view.getByRole('button', { name: 'Копировать вопрос' }).click()

		expect(onClick).toHaveBeenCalledTimes(1)
	})
})
