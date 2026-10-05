import type { CurrentUser } from '#/lib/auth/get-session'
import type { RemoveAvatarActionResult, UpdateAvatarActionResult } from '#/modules/auth/types'

import { describe, expect, it, vi } from 'vitest'

import { createAvatarFile } from '#/tests/fixtures/avatar-files'
import { renderWithProviders } from '#/tests/render'

import { ProfileAvatarUpload } from './profile-avatar-upload'

const updateAvatarAction = vi.fn<(formData: FormData) => Promise<UpdateAvatarActionResult>>()
const removeAvatarAction = vi.fn<() => Promise<RemoveAvatarActionResult>>()

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	role: 'developer',
}

const userWithAvatar: CurrentUser = { ...user, image: 'http://localhost/api/avatars/1' }

function resetMocks() {
	updateAvatarAction.mockReset()
	removeAvatarAction.mockReset()
}

describe('<ProfileAvatarUpload />', () => {
	it('открывает поповер действий по клику на аватар', async () => {
		resetMocks()

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={user}
			/>,
		)

		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()

		await expect.element(view.getByText('Загрузить новое фото')).toBeVisible()
	})

	it('не показывает пункт «Удалить фото», если у пользователя нет аватара', async () => {
		resetMocks()

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={user}
			/>,
		)

		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()

		await expect.element(view.getByText('Удалить фото')).not.toBeInTheDocument()
	})

	it('показывает пункт «Удалить фото», если у пользователя есть аватар', async () => {
		resetMocks()

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={userWithAvatar}
			/>,
		)

		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()

		await expect.element(view.getByText('Удалить фото')).toBeVisible()
	})

	it('показывает заглушку с инициалом, пока фото не выбрано', async () => {
		resetMocks()

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={user}
			/>,
		)

		await expect.element(view.getByText('С', { exact: true })).toBeVisible()
	})

	it('отправляет выбранный файл в server action через пункт «Загрузить новое фото»', async () => {
		resetMocks()
		updateAvatarAction.mockResolvedValue({ ok: true, image: 'http://localhost/api/avatars/1' })

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={user}
			/>,
		)
		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()
		await view.getByLabelText('Изменить фото профиля').upload(createAvatarFile())

		await vi.waitFor(() => {
			expect(updateAvatarAction).toHaveBeenCalledTimes(1)
		})
		const formData = updateAvatarAction.mock.calls[0]![0]
		expect(formData.get('avatar')).toBeInstanceOf(File)
	})

	it('показывает сообщение об ошибке и не теряет текущее фото при неуспешной загрузке', async () => {
		resetMocks()
		updateAvatarAction.mockResolvedValue({ ok: false, error: 'Не удалось выполнить запрос' })

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={user}
			/>,
		)
		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()
		await view.getByLabelText('Изменить фото профиля').upload(createAvatarFile())

		await expect.element(view.getByText('Не удалось выполнить запрос')).toBeVisible()
		await expect.element(view.getByText('С', { exact: true })).toBeVisible()
	})

	it('отклоняет недопустимый формат файла без вызова server action', async () => {
		resetMocks()

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={user}
			/>,
		)
		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()
		await view
			.getByLabelText('Изменить фото профиля')
			.upload(new File(['data'], 'avatar.gif', { type: 'image/gif' }))

		await expect
			.element(view.getByText('Выберите изображение в формате JPEG, PNG или WebP'))
			.toBeVisible()
		expect(updateAvatarAction).not.toHaveBeenCalled()
	})

	it('вызывает removeAction при выборе «Удалить фото» и не показывает ошибку при успехе', async () => {
		resetMocks()
		removeAvatarAction.mockResolvedValue({ ok: true })

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={userWithAvatar}
			/>,
		)
		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()
		await view.getByRole('button', { name: 'Удалить фото' }).click()

		await vi.waitFor(() => {
			expect(removeAvatarAction).toHaveBeenCalledTimes(1)
		})
		await expect.element(view.getByRole('alert')).not.toBeInTheDocument()
	})

	it('показывает сообщение об ошибке и не меняет изображение при неуспешном удалении', async () => {
		resetMocks()
		removeAvatarAction.mockResolvedValue({ ok: false, error: 'Не удалось выполнить запрос' })

		const view = await renderWithProviders(
			<ProfileAvatarUpload
				action={updateAvatarAction}
				removeAction={removeAvatarAction}
				user={userWithAvatar}
			/>,
		)
		await view.getByRole('button', { name: 'Действия с фото профиля' }).click()
		await view.getByRole('button', { name: 'Удалить фото' }).click()

		await expect.element(view.getByText('Не удалось выполнить запрос')).toBeVisible()
		await expect.element(view.getByText('С', { exact: true })).not.toBeInTheDocument()
	})
})
