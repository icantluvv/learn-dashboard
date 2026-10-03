import type { CurrentUser } from '#/lib/auth/get-session'
import type { UpdateAvatarActionResult } from '#/modules/auth/types'

import { describe, expect, it, vi } from 'vitest'

import { createAvatarFile } from '#/tests/fixtures/avatar-files'
import { renderWithProviders } from '#/tests/render'

import { ProfileAvatarUpload } from './profile-avatar-upload'

const updateAvatarAction = vi.fn<(formData: FormData) => Promise<UpdateAvatarActionResult>>()

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	role: 'developer',
}

describe('<ProfileAvatarUpload />', () => {
	it('открывает выбор файла по клику на аватар (input доступен по подписи)', async () => {
		updateAvatarAction.mockReset()

		const view = await renderWithProviders(
			<ProfileAvatarUpload action={updateAvatarAction} user={user} />,
		)

		await expect.element(view.getByLabelText('Изменить фото профиля')).toBeInTheDocument()
	})

	it('показывает заглушку с инициалом, пока фото не выбрано', async () => {
		updateAvatarAction.mockReset()

		const view = await renderWithProviders(
			<ProfileAvatarUpload action={updateAvatarAction} user={user} />,
		)

		await expect.element(view.getByText('С', { exact: true })).toBeVisible()
	})

	it('отправляет выбранный файл в server action', async () => {
		updateAvatarAction.mockReset()
		updateAvatarAction.mockResolvedValue({ ok: true, image: 'http://localhost/api/avatars/1' })

		const view = await renderWithProviders(
			<ProfileAvatarUpload action={updateAvatarAction} user={user} />,
		)
		await view.getByLabelText('Изменить фото профиля').upload(createAvatarFile())

		await vi.waitFor(() => {
			expect(updateAvatarAction).toHaveBeenCalledTimes(1)
		})
		const formData = updateAvatarAction.mock.calls[0]![0]
		expect(formData.get('avatar')).toBeInstanceOf(File)
	})

	it('показывает сообщение об ошибке и не теряет текущее фото при неуспешном ответе action', async () => {
		updateAvatarAction.mockReset()
		updateAvatarAction.mockResolvedValue({ ok: false, error: 'Не удалось выполнить запрос' })

		const view = await renderWithProviders(
			<ProfileAvatarUpload action={updateAvatarAction} user={user} />,
		)
		await view.getByLabelText('Изменить фото профиля').upload(createAvatarFile())

		await expect.element(view.getByText('Не удалось выполнить запрос')).toBeVisible()
		await expect.element(view.getByText('С', { exact: true })).toBeVisible()
	})

	it('отклоняет недопустимый формат файла без вызова server action', async () => {
		updateAvatarAction.mockReset()

		const view = await renderWithProviders(
			<ProfileAvatarUpload action={updateAvatarAction} user={user} />,
		)
		await view
			.getByLabelText('Изменить фото профиля')
			.upload(new File(['data'], 'avatar.gif', { type: 'image/gif' }))

		await expect
			.element(view.getByText('Выберите изображение в формате JPEG, PNG или WebP'))
			.toBeVisible()
		expect(updateAvatarAction).not.toHaveBeenCalled()
	})
})
