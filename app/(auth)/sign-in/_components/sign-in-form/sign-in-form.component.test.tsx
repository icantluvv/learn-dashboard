import type { AuthActionResult } from '#/modules/auth/types'
import type { RoutePath } from '#/seo'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { nextRouterMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

import { SignInForm } from './sign-in-form'

const signInAction = vi.fn<(values: unknown) => Promise<AuthActionResult>>()

async function renderForm(action: typeof signInAction, redirectPath: RoutePath = '/') {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

	return render(
		<QueryClientProvider client={queryClient}>
			<SignInForm action={action} redirectPath={redirectPath} />
		</QueryClientProvider>,
	)
}

const invalidCredentials = 'Неверный email или пароль'

describe('<SignInForm />', () => {
	beforeEach(() => {
		signInAction.mockReset()
		signInAction.mockResolvedValue({ ok: true })
		resetNextNavigationMock()
	})

	it('показывает поля входа и ссылку на регистрацию', async () => {
		const view = await renderForm(signInAction)

		await expect.element(view.getByRole('textbox', { name: 'Email' })).toBeVisible()
		await expect.element(view.getByLabelText('Пароль')).toBeVisible()
		await expect.element(view.getByRole('link', { name: 'Зарегистрироваться' })).toBeVisible()
	})

	it('блокирует отправку, пока email и пароль не заполнены', async () => {
		const view = await renderForm(signInAction)
		const submit = view.getByRole('button', { name: 'Войти' })

		await expect.element(submit).toBeDisabled()
		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await expect.element(submit).toBeDisabled()
		await view.getByLabelText('Пароль').fill('12345678')

		await expect.element(submit).toBeEnabled()
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

		await expect.element(view.getByRole('button', { name: 'Загрузка' })).toBeDisabled()
		await expect.element(view.getByRole('status', { name: 'Загрузка' })).toBeVisible()

		resolveAction?.({ ok: true })

		await vi.waitFor(() => {
			expect(signInAction).toHaveBeenCalledTimes(1)
		})
	})

	it('после успешного входа уводит на переданный путь возврата', async () => {
		const view = await renderForm(signInAction, '/catalog/frontend/js-closures')

		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await view.getByRole('button', { name: 'Войти' }).click()

		await vi.waitFor(() => {
			expect(nextRouterMock.replace).toHaveBeenCalledWith('/catalog/frontend/js-closures')
		})
	})

	it('после успешного входа без пути возврата уводит на главную', async () => {
		const view = await renderForm(signInAction)

		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await view.getByRole('button', { name: 'Войти' }).click()

		await vi.waitFor(() => {
			expect(nextRouterMock.replace).toHaveBeenCalledWith('/')
		})
	})
})
