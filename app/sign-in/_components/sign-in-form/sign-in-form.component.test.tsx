import type { AuthActionResult } from '#/modules/auth/types'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { SignInForm } from './sign-in-form'

const signInAction = vi.fn<(values: unknown) => Promise<AuthActionResult>>()

async function renderForm(action: typeof signInAction) {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

	return render(
		<QueryClientProvider client={queryClient}>
			<SignInForm action={action} />
		</QueryClientProvider>,
	)
}

const invalidCredentials = 'Неверный email или пароль'

describe('<SignInForm />', () => {
	beforeEach(() => {
		signInAction.mockReset()
		signInAction.mockResolvedValue({ ok: true })
	})

	it('показывает поля входа и ссылку на регистрацию', async () => {
		const view = await renderForm(signInAction)

		await expect.element(view.getByRole('textbox', { name: 'Email' })).toBeVisible()
		await expect.element(view.getByLabelText('Пароль')).toBeVisible()
		await expect.element(view.getByRole('link', { name: 'Зарегистрироваться' })).toBeVisible()
	})

	it('не отправляет форму с пустыми полями', async () => {
		const view = await renderForm(signInAction)

		await view.getByRole('button', { name: 'Войти' }).click()

		await expect.element(view.getByText('Введите пароль')).toBeVisible()
		expect(signInAction).not.toHaveBeenCalled()
	})

	it('отправляет валидные учётные данные', async () => {
		const view = await renderForm(signInAction)

		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await view.getByRole('button', { name: 'Войти' }).click()

		await vi.waitFor(() => {
			expect(signInAction).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: '12345678',
			})
		})
	})

	it('показывает одно и то же сообщение при неверном пароле и неизвестном email', async () => {
		signInAction.mockResolvedValue({ ok: false, formError: invalidCredentials })
		const view = await renderForm(signInAction)

		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('wrong-password')
		await view.getByRole('button', { name: 'Войти' }).click()
		await expect.element(view.getByText(invalidCredentials)).toBeVisible()

		await view.getByRole('textbox', { name: 'Email' }).fill('nobody@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await view.getByRole('button', { name: 'Войти' }).click()
		await expect.element(view.getByText(invalidCredentials)).toBeVisible()
	})

	it('блокирует кнопку на время отправки', async () => {
		let resolveAction: ((result: AuthActionResult) => void) | undefined
		signInAction.mockImplementation(
			async () =>
				new Promise<AuthActionResult>((resolve) => {
					resolveAction = resolve
				}),
		)
		const view = await renderForm(signInAction)

		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await view.getByRole('button', { name: 'Войти' }).click()

		await expect.element(view.getByRole('button', { name: 'Входим...' })).toBeDisabled()

		resolveAction?.({ ok: true })

		await vi.waitFor(() => {
			expect(signInAction).toHaveBeenCalledTimes(1)
		})
	})
})
