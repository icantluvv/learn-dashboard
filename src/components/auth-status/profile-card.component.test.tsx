import type { CurrentUser } from '#/lib/auth/get-session'

import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { ProfileCard } from './profile-card'

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
	role: 'developer',
}

describe('<ProfileCard />', () => {
	it('показывает имя и email пользователя', async () => {
		const view = await render(<ProfileCard user={user} />)

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByText('user@example.com', { exact: true })).toBeVisible()
	})

	it('не содержит действия выхода из аккаунта', async () => {
		const view = await render(<ProfileCard user={user} />)

		await expect.element(view.getByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
	})
})
