import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { Button } from '../button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer'

function TestDrawer() {
	return (
		<Drawer>
			<DrawerTrigger render={<Button>Открыть фильтры</Button>} />

			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Фильтры</DrawerTitle>
				</DrawerHeader>

				<Button>Сбросить фильтры</Button>
			</DrawerContent>
		</Drawer>
	)
}

describe('<Drawer />', () => {
	it('открывается по триггеру и показывает содержимое', async () => {
		const view = await render(<TestDrawer />)

		await view.getByRole('button', { name: 'Открыть фильтры' }).click()

		await expect.element(view.getByRole('heading', { name: 'Фильтры' })).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Сбросить фильтры' })).toBeVisible()
	})

	it('закрывается по Escape и возвращает фокус триггеру', async () => {
		const view = await render(<TestDrawer />)

		const trigger = view.getByRole('button', { name: 'Открыть фильтры' })
		const title = view.getByRole('heading', { name: 'Фильтры' })

		await trigger.click()
		await expect.element(title).toBeVisible()

		await userEvent.keyboard('{Escape}')

		await expect.element(trigger).toHaveFocus()
	})
})
