import type { AuthActionResult } from '#/modules/auth/types'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { createAvatarFile } from '#/tests/fixtures/avatar-files'

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
	await view.getByRole('combobox', { name: 'Кем вы являетесь' }).click()
	await view.getByRole('option', { name: 'Разработчик' }).click()
}

describe('<SignUpForm />', () => {
	beforeEach(() => {
		signUpAction.mockReset()
		signUpAction.mockResolvedValue({ ok: true })
	})

	it('показывает поля регистрации и ссылку на вход', async () => {
		const view = await renderForm(signUpAction)

		await expect.element(view.getByRole('textbox', { name: 'Имя' })).toBeVisible()
		await expect.element(view.getByRole('textbox', { name: 'Фамилия' })).toBeVisible()
		await expect.element(view.getByRole('textbox', { name: 'Email' })).toBeVisible()
		await expect.element(view.getByLabelText('Пароль')).toBeVisible()
		await expect.element(view.getByRole('combobox', { name: 'Пол' })).toBeVisible()
		await expect.element(view.getByRole('spinbutton', { name: 'Возраст' })).toBeVisible()
		await expect.element(view.getByRole('combobox', { name: 'Кем вы являетесь' })).toBeVisible()
		await expect.element(view.getByLabelText('Выбрать изображение')).toBeInTheDocument()
		await expect.element(view.getByRole('link', { name: 'Войти' })).toBeVisible()
		expect(document.querySelectorAll('label [aria-hidden="true"]')).toHaveLength(5)
	})

	it('показывает аватар первым полем формы', async () => {
		const view = await renderForm(signUpAction)
		const avatar = view.getByText('Аватар').element()
		const name = view.getByRole('textbox', { name: 'Имя' }).element()

		expect(avatar.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
	})

	it('предлагает только мужской и женский пол', async () => {
		const view = await renderForm(signUpAction)

		await view.getByRole('combobox', { name: 'Пол' }).click()

		await expect.element(view.getByRole('option', { name: 'Мужской' })).toBeVisible()
		await expect.element(view.getByRole('option', { name: 'Женский' })).toBeVisible()
		expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
	})

	it('предлагает варианты роли «Разработчик», «Аналитик», «Студент», «Начинающий»', async () => {
		const view = await renderForm(signUpAction)

		await view.getByRole('combobox', { name: 'Кем вы являетесь' }).click()

		await expect.element(view.getByRole('option', { name: 'Разработчик' })).toBeVisible()
		await expect.element(view.getByRole('option', { name: 'Аналитик' })).toBeVisible()
		await expect.element(view.getByRole('option', { name: 'Студент' })).toBeVisible()
		await expect.element(view.getByRole('option', { name: 'Начинающий' })).toBeVisible()
		expect(document.querySelectorAll('[role="option"]')).toHaveLength(4)
	})

	it('показывает и удаляет предпросмотр выбранного аватара', async () => {
		const view = await renderForm(signUpAction)

		await view.getByLabelText('Выбрать изображение').upload(createAvatarFile())

		await expect.element(view.getByRole('img', { name: 'Предпросмотр аватара' })).toBeVisible()
		await expect.element(view.getByText('avatar.png')).toBeVisible()

		await view.getByRole('button', { name: 'Удалить изображение' }).click()

		await expect.element(view.getByLabelText('Выбрать изображение')).toBeInTheDocument()
	})

	it('принимает аватар перетаскиванием', async () => {
		const view = await renderForm(signUpAction)
		const dataTransfer = new DataTransfer()
		dataTransfer.items.add(createAvatarFile('image/jpeg'))

		view.getByTestId('avatar-dropzone')
			.element()
			.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer }))

		await expect.element(view.getByRole('img', { name: 'Предпросмотр аватара' })).toBeVisible()
		await expect.element(view.getByText('avatar.jpeg')).toBeVisible()
	})

	it('отклоняет неподдерживаемый файл', async () => {
		const view = await renderForm(signUpAction)

		await view
			.getByLabelText('Выбрать изображение')
			.upload(new File(['text'], 'avatar.txt', { type: 'text/plain' }))

		await expect.element(view.getByRole('alert')).toHaveTextContent(/JPEG, PNG или WebP/)
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

	it('блокирует отправку, пока обязательные поля не заполнены', async () => {
		const view = await renderForm(signUpAction)
		const submit = view.getByRole('button', { name: 'Зарегистрироваться' })

		await expect.element(submit).toBeDisabled()
		await view.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
		await view.getByRole('textbox', { name: 'Email' }).fill('user@example.com')
		await view.getByLabelText('Пароль').fill('12345678')
		await expect.element(submit).toBeDisabled()
		await view.getByRole('combobox', { name: 'Пол' }).click()
		await view.getByRole('option', { name: 'Мужской' }).click()
		await expect.element(submit).toBeDisabled()
		await view.getByRole('combobox', { name: 'Кем вы являетесь' }).click()
		await view.getByRole('option', { name: 'Разработчик' }).click()

		await expect.element(submit).toBeEnabled()
	})

	it('отправляет валидную форму без фамилии, возраста и аватара', async () => {
		const view = await renderForm(signUpAction)

		await fillValidForm(view)
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await vi.waitFor(() => {
			const formData = signUpAction.mock.calls[0]?.[0]

			expect(formData).toBeInstanceOf(FormData)
			expect(Object.fromEntries((formData as FormData).entries())).toStrictEqual({
				name: 'Сергей',
				lastName: '',
				email: 'user@example.com',
				password: '12345678',
				gender: 'male',
				age: '28',
				role: 'developer',
			})
		})
	})

	it('отправляет выбранный аватар как File', async () => {
		const view = await renderForm(signUpAction)
		const avatar = createAvatarFile()

		await fillValidForm(view)
		await view.getByLabelText('Выбрать изображение').upload(avatar)
		await view.getByRole('button', { name: 'Зарегистрироваться' }).click()

		await vi.waitFor(() => {
			const formData = signUpAction.mock.calls[0]?.[0] as FormData
			expect(formData.get('avatar')).toBeInstanceOf(File)
			expect((formData.get('avatar') as File).name).toBe('avatar.png')
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

		await expect.element(view.getByRole('button', { name: 'Загрузка' })).toBeDisabled()
		await expect.element(view.getByRole('status', { name: 'Загрузка' })).toBeVisible()

		resolveAction?.({ ok: true })

		await vi.waitFor(() => {
			expect(signUpAction).toHaveBeenCalledTimes(1)
		})
	})
})
