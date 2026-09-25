import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { Button } from '../button'
import { Toaster, useToastManager } from './toast'

function TestToaster() {
	return (
		<Toaster>
			<AddToastButton />
		</Toaster>
	)
}

function AddToastButton() {
	const manager = useToastManager()

	return (
		<Button
			onClick={() => {
				manager.add({ title: 'Фильтры сброшены' })
			}}
		>
			Показать уведомление
		</Button>
	)
}

describe('<Toaster />', () => {
	it('показывает добавленное уведомление', async () => {
		const view = await render(<TestToaster />)

		await view.getByRole('button', { name: 'Показать уведомление' }).click()

		await expect.element(view.getByText('Фильтры сброшены')).toBeVisible()
	})
})
