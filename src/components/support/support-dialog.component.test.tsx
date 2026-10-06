import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { SUPPORT_EMAIL, SUPPORT_TELEGRAM_URL } from '#/constants/support'

import { SupportDialog } from './support-dialog'
import { SupportFab } from './support-fab'

function TestSupportDialog() {
	return <SupportDialog trigger={<SupportFab />} />
}

describe('<SupportDialog />', () => {
	it('не показывает содержимое до нажатия', async () => {
		const view = await render(<TestSupportDialog />)

		await expect.element(view.getByText('Поддержка')).not.toBeInTheDocument()
	})

	it('открывается по нажатию на кнопку и показывает заголовок и описание', async () => {
		const view = await render(<TestSupportDialog />)

		await view.getByRole('button', { name: 'Поддержка' }).click()

		await expect.element(view.getByRole('heading', { name: 'Поддержка' })).toBeVisible()
		await expect
			.element(
				view.getByText(
					'Вы можете обратиться с проблемой или пожеланием для доработки сервиса',
				),
			)
			.toBeVisible()
	})

	it('ссылка «Почта» ведёт на mailto-адрес без target', async () => {
		const view = await render(<TestSupportDialog />)

		await view.getByRole('button', { name: 'Поддержка' }).click()

		const mailLink = view.getByRole('link', { name: 'Почта' })

		await expect.element(mailLink).toHaveAttribute('href', `mailto:${SUPPORT_EMAIL}`)
		await expect.element(mailLink).not.toHaveAttribute('target')
	})

	it('ссылка «Telegram» открывается безопасно в новой вкладке', async () => {
		const view = await render(<TestSupportDialog />)

		await view.getByRole('button', { name: 'Поддержка' }).click()

		const telegramLink = view.getByRole('link', { name: 'Telegram' })

		await expect.element(telegramLink).toHaveAttribute('href', SUPPORT_TELEGRAM_URL)
		await expect.element(telegramLink).toHaveAttribute('target', '_blank')
		await expect.element(telegramLink).toHaveAttribute('rel', 'noreferrer nofollow')
	})

	it('содержит ровно две ссылки связи', async () => {
		const view = await render(<TestSupportDialog />)

		await view.getByRole('button', { name: 'Поддержка' }).click()

		await expect.element(view.getByRole('link', { name: 'Почта' })).toBeVisible()
		await expect.element(view.getByRole('link', { name: 'Telegram' })).toBeVisible()
		expect(document.querySelectorAll('[role="dialog"] a')).toHaveLength(2)
	})

	it('закрывается по Escape и возвращает фокус кнопке', async () => {
		const view = await render(<TestSupportDialog />)

		const trigger = view.getByRole('button', { name: 'Поддержка' })

		await trigger.click()
		await expect.element(view.getByText('Поддержка')).toBeVisible()

		await userEvent.keyboard('{Escape}')

		await expect.element(view.getByText('Поддержка')).not.toBeInTheDocument()
		await expect.element(trigger).toHaveFocus()
	})
})
