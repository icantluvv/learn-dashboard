import type { ReactNode } from 'react'

import type { CurrentUser } from '#/lib/auth/get-session'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

const signOut = vi.fn(async () => {})

vi.mock('#/lib/auth/client', () => ({
	authClient: { signOut: async () => signOut() },
}))

const { ProfilePopover } = await import('./profile-popover')

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
}

function withQueryClient(children: ReactNode) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false, gcTime: 0 } },
	})

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('<ProfilePopover />', () => {
	beforeEach(() => {
		signOut.mockClear()
	})

	it('сразу показывает имя, email и кнопку выхода без предварительного клика', async () => {
		const view = await render(withQueryClient(<ProfilePopover user={user} />))

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByText('user@example.com', { exact: true })).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()
	})

	it('вызывает выход по клику на кнопку выхода', async () => {
		const view = await render(withQueryClient(<ProfilePopover user={user} />))

		await view.getByRole('button', { name: 'Выйти' }).click()

		await vi.waitFor(() => {
			expect(signOut).toHaveBeenCalledTimes(1)
		})
	})

	it('показывает лоадер на месте иконки и блокирует кнопку, пока запрос выхода не завершён', async () => {
		let resolveSignOut: () => void = () => {}

		signOut.mockImplementationOnce(
			async () =>
				new Promise<void>((resolve) => {
					resolveSignOut = resolve
				}),
		)

		const view = await render(withQueryClient(<ProfilePopover user={user} />))
		const trigger = view.getByRole('button', { name: 'Выйти' })

		await trigger.click()

		await expect.element(view.getByRole('status', { name: 'Загрузка' })).toBeVisible()
		await expect.element(trigger).toBeDisabled()

		resolveSignOut()

		await expect.element(view.getByRole('status', { name: 'Загрузка' })).not.toBeInTheDocument()
		await expect.element(trigger).toBeEnabled()
	})
})
