import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { Button } from './button'

describe('<Button />', () => {
	it('вызывает обработчик по клику', async () => {
		const onClick = vi.fn()

		const view = await render(<Button onClick={onClick}>Отправить</Button>)

		await view.getByRole('button', { name: 'Отправить' }).click()

		expect(onClick).toHaveBeenCalledTimes(1)
	})

	it('не вызывает обработчик в disabled-состоянии', async () => {
		const onClick = vi.fn()

		const view = await render(
			<Button disabled onClick={onClick}>
				Отправить
			</Button>,
		)

		const button = view.getByRole('button', { name: 'Отправить' })

		await expect.element(button).toBeDisabled()
		expect(onClick).not.toHaveBeenCalled()
	})

	it('сохраняет доступное имя у иконочной кнопки', async () => {
		const view = await render(
			<Button aria-label="Открыть фильтры" size="icon">
				<svg aria-hidden="true" />
			</Button>,
		)

		await expect.element(view.getByRole('button', { name: 'Открыть фильтры' })).toBeVisible()
	})
})
