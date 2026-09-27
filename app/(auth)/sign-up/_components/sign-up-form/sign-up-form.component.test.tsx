import type { AuthActionResult } from '#/modules/auth/types'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { SignUpForm } from './sign-up-form'

const signUpAction = vi.fn<(values: unknown) => Promise<AuthActionResult>>()

async function renderForm(action: typeof signUpAction) {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

	return render(
		<QueryClientProvider client={queryClient}>
			<SignUpForm action={action} />
		</QueryClientProvider>,
	)
}

async function fillValidForm(view: Awaited<ReturnType<typeof render>>) {
	await view.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
	await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
	await view.getByLabelText('Пароль').fill('12345678')
	await view.getByRole('combobox', { name: 'Пол' }).click()
	await view.getByRole('option', { name: 'Мужской' }).click()
	await view.getByRole('spinbutton', { name: 'Возраст' }).fill('28')
}

describe('<SignUpForm />', () => {
	beforeEach(() => {
		signUpAction.mockReset()
		signUpAction.mockResolvedValue({ ok: true })
	})

	it('показывает поля регистрации и ссылку на вход', async () => {
		const view = await renderForm(signUpAction)

		await expect.element(view.getByRole('textbox', { name: 'Имя' })).toBeVisible()
		await expect.element(view.getByRole('textbox', { name: 'Email' })).toBeVisible()
		await expect.element(view.getByLabelText('Пароль')).toBeVisible()
		await expect.element(view.getByRole('combobox', { name: 'Пол' })).toBeVisible()
		await expect.element(view.getByRole('spinbutton', { name: 'Возраст' })).toBeVisible()
		await expect
			.element(view.getByRole('textbox', { name: 'Ссылка на аватар (необязательно)' }))
			.toBeVisible()
		await expect.element(view.getByRole('link', { name: 'Войти' })).toBeVisible()
	})

	it('не отправляет форму, пока имя короче 3 символов', async () => {
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByRole('textbox', { name: 'Имя' }).fill('Ан')
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await expect.element(view.getByText('Имя должно содержать минимум 3 символа')).toBeVisible()
		expect(signUpAction).not.toHaveBeenCalled()
	})

	it('не отправляет форму, пока пароль короче 8 символов', async () => {
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByLabelText('Пароль').fill('1234567')
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await expect
			.element(view.getByText('Пароль должен содержать минимум 8 символов'))
			.toBeVisible()
		expect(signUpAction).not.toHaveBeenCalled()
	})

	it('не отправляет форму с некорректным email', async () => {
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByRole('textbox', { name: 'Email' }).fill('user.example.com')
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await expect.element(view.getByText('Введите корректный email')).toBeVisible()
		expect(signUpAction).not.toHaveBeenCalled()
	})

	it('требует пол и возраст', async () => {
		const view = await renderForm(signUpAction)

		await view.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await expect.element(view.getByText('Укажите возраст')).toBeVisible()
		expect(signUpAction).not.toHaveBeenCalled()
	})

	it('отправляет валидную форму без аватара', async () => {
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await vi.waitFor(() => {
			expect(signUpAction).toHaveBeenCalledWith({
				name: 'Сергей',
				email: 'user@example.com',
				password: '12345678',
				gender: 'male',
				age: 28,
				image: '',
			})
		})
	})

	it('показывает серверную ошибку занятого email, сохраняя введённые значения', async () => {
		signUpAction.mockResolvedValue({
			ok: false,
			fieldErrors: { email: 'Этот email уже используется' },
		})
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await expect.element(view.getByText('Этот email уже используется')).toBeVisible()
		await expect.element(view.getByRole('textbox', { name: 'Имя' })).toHaveValue('Сергей')
	})

	it('показывает общую ошибку формы', async () => {
		signUpAction.mockResolvedValue({ ok: false, formError: 'Не удалось выполнить запрос' })
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await expect.element(view.getByText('Не удалось выполнить запрос')).toBeVisible()
	})

	it('отправляет форму один раз при двойном клике', async () => {
		let resolveAction: ((result: AuthActionResult) => void) | undefined
		signUpAction.mockImplementation(
			async () =>
				new Promise<AuthActionResult>((resolve) => {
					resolveAction = resolve
				}),
		)
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		const submit = view.getByRole('button', { name: 'Зарегистрироваться' })
		await submit.click()

		await expect.element(view.getByRole('button', { name: 'Регистрируем...' })).toBeDisabled()

		resolveAction?.({ ok: true })

		await vi.waitFor(() => {
			expect(signUpAction).toHaveBeenCalledTimes(1)
		})
	})
})
