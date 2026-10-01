import { Toaster } from '@repo/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { CopyQuestionButton } from './copy-question-button'

const question = 'Что такое замыкание?'

const writeText = vi.fn<(text: string) => Promise<void>>()

async function renderButton() {
	const view = render(
		<Toaster>
			<CopyQuestionButton question={question} />
		</Toaster>,
	)

	return view
}

describe('<CopyQuestionButton />', () => {
	beforeEach(() => {
		writeText.mockReset()
		writeText.mockResolvedValue(undefined)
		// Реальный буфер обмена в headless-браузере требует отдельных разрешений, а проверяется
		// здесь именно то, что копируется ровно текст вопроса.
		vi.stubGlobal(
			'navigator',
			new Proxy(navigator, {
				get(target, property) {
					if (property === 'clipboard') {
						return { writeText }
					}

					return Reflect.get(target, property) as unknown
				},
			}),
		)
	})

	it('копирует текст только этого вопроса, без номера', async () => {
		const view = await renderButton()

		await view.getByRole('button', { name: 'копировать вопрос' }).click()

		await vi.waitFor(() => {
			expect(writeText).toHaveBeenCalledWith(question)
		})
		expect(writeText).toHaveBeenCalledTimes(1)
	})

	it('подтверждает успешное копирование', async () => {
		const view = await renderButton()

		await view.getByRole('button', { name: 'копировать вопрос' }).click()

		await expect.element(view.getByText('Вопрос скопирован')).toBeVisible()
	})

	it('копирует при активации с клавиатуры', async () => {
		const view = await renderButton()

		await userEvent.keyboard('{Tab}')
		await expect.element(view.getByRole('button', { name: 'копировать вопрос' })).toHaveFocus()
		await userEvent.keyboard('{Enter}')

		await vi.waitFor(() => {
			expect(writeText).toHaveBeenCalledWith(question)
		})
	})

	it('сообщает о неудаче, если браузер отказал в доступе к буферу обмена', async () => {
		writeText.mockRejectedValue(new Error('NotAllowedError'))
		const view = await renderButton()

		await view.getByRole('button', { name: 'копировать вопрос' }).click()

		await expect.element(view.getByText('Не удалось скопировать вопрос')).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'копировать вопрос' })).toBeVisible()
	})

	it('показывает подсказку при наведении', async () => {
		const view = await renderButton()

		await userEvent.hover(view.getByRole('button', { name: 'копировать вопрос' }))

		await expect.element(view.getByText('копировать вопрос', { exact: true })).toBeVisible()
	})

	it('показывает подсказку при фокусе с клавиатуры', async () => {
		const view = await renderButton()

		await userEvent.keyboard('{Tab}')

		await expect.element(view.getByText('копировать вопрос', { exact: true })).toBeVisible()
	})
})
