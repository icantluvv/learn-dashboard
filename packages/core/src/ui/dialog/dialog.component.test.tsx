import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { Button } from '../button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './dialog'

function TestDialog() {
	return (
		<Dialog>
			<DialogTrigger render={<Button>Открыть диалог</Button>} />

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Заголовок</DialogTitle>
					<DialogDescription>Описание диалога</DialogDescription>
				</DialogHeader>

				<DialogClose render={<Button>Закрыть</Button>} />
			</DialogContent>
		</Dialog>
	)
}

function ControlledDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
	return (
		<Dialog open onOpenChange={onOpenChange}>
			<DialogTrigger render={<Button>Открыть диалог</Button>} />

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Заголовок</DialogTitle>
				</DialogHeader>

				<DialogClose render={<Button>Закрыть</Button>} />
			</DialogContent>
		</Dialog>
	)
}

describe('<Dialog />', () => {
	it('открывается по триггеру и получает доступное имя и описание', async () => {
		const view = await render(<TestDialog />)

		await view.getByRole('button', { name: 'Открыть диалог' }).click()

		await expect
			.element(view.getByRole('dialog', { name: 'Заголовок' }))
			.toHaveAccessibleDescription('Описание диалога')
	})

	it('не рендерит содержимое в закрытом состоянии', async () => {
		const view = await render(<TestDialog />)

		await expect.element(view.getByText('Заголовок')).not.toBeInTheDocument()
	})

	it('закрывается по Escape и возвращает фокус триггеру', async () => {
		const view = await render(<TestDialog />)

		const trigger = view.getByRole('button', { name: 'Открыть диалог' })

		await trigger.click()
		await expect.element(view.getByText('Заголовок')).toBeVisible()

		await userEvent.keyboard('{Escape}')

		await expect.element(view.getByText('Заголовок')).not.toBeInTheDocument()
		await expect.element(trigger).toHaveFocus()
	})

	it('закрывается по нажатию на DialogClose', async () => {
		const view = await render(<TestDialog />)

		await view.getByRole('button', { name: 'Открыть диалог' }).click()
		await view.getByRole('button', { name: 'Закрыть' }).click()

		await expect.element(view.getByText('Заголовок')).not.toBeInTheDocument()
	})

	it('в управляемом режиме подчиняется внешнему состоянию', async () => {
		const onOpenChange = vi.fn()
		const view = await render(<ControlledDialog onOpenChange={onOpenChange} />)

		await expect.element(view.getByText('Заголовок')).toBeVisible()

		await view.getByRole('button', { name: 'Закрыть' }).click()

		expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
		await expect.element(view.getByText('Заголовок')).toBeVisible()
	})
})
