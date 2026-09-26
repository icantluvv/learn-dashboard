import type { ReactNode } from 'react'

import type { CurrentUser } from '#/lib/auth/get-session'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'

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

	it('открывается по клику и показывает имя, email и кнопку выхода', async () => {
		const view = await render(withQueryClient(<ProfilePopover user={user} />))

		await view.getByRole('button', { name: 'Профиль: Сергей' }).click()

		await expect.element(view.getByText('Сергей', { exact: true })).toBeVisible()
		await expect.element(view.getByText('user@example.com', { exact: true })).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()
	})

	it('имеет ширину 300px', async () => {
		await page.viewport(1280, 800)

		const view = await render(withQueryClient(<ProfilePopover user={user} />))

		await view.getByRole('button', { name: 'Профиль: Сергей' }).click()

		const content = view
			.getByRole('button', { name: 'Выйти' })
			.element()
			.closest('[data-slot="popover-content"]')

		expect(content).not.toBeNull()
		// getBoundingClientRect ловит scale-анимацию открытия, поэтому сверяем объявленную ширину.
		expect(content == null ? null : globalThis.getComputedStyle(content).width).toBe('300px')
	})

	it('закрывается по Escape и возвращает фокус на кнопку-аватар', async () => {
		const view = await render(withQueryClient(<ProfilePopover user={user} />))

		const trigger = view.getByRole('button', { name: 'Профиль: Сергей' })

		await trigger.click()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()

		await userEvent.keyboard('{Escape}')

		await expect.element(view.getByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
		await expect.element(trigger).toHaveFocus()
	})

	it('вызывает выход и закрывает попап', async () => {
		const view = await render(withQueryClient(<ProfilePopover user={user} />))

		await view.getByRole('button', { name: 'Профиль: Сергей' }).click()
		await view.getByRole('button', { name: 'Выйти' }).click()

		await vi.waitFor(() => {
			expect(signOut).toHaveBeenCalledTimes(1)
		})

		await expect.element(view.getByRole('button', { name: 'Выйти' })).not.toBeInTheDocument()
	})
})
