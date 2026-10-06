import type { GetAuthMe200 } from '@repo/api'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

import { resetNextNavigationMock } from '#/tests/mocks/next-navigation'
import { renderWithProviders } from '#/tests/render'

const getAuthMe = vi.fn<() => Promise<GetAuthMe200>>()

vi.mock('@repo/api/base/codegen/clients/meController/getAuthMe', () => ({
	getAuthMe: async () => getAuthMe(),
}))

vi.mock('#/components/auth-status', () => ({
	AuthStatusSlot: () => <div data-testid="account-slot">Аккаунт</div>,
}))

const { Layout } = await import('./layout')

describe('<Layout />', () => {
	beforeEach(() => {
		resetNextNavigationMock()
		getAuthMe.mockRejectedValue(new Error('Unauthorized', { cause: { status: 401 } }))
	})

	it('на десктопной ширине показывает ровно одну кнопку вызова поддержки', async () => {
		await page.viewport(1280, 800)

		const view = await renderWithProviders(<Layout>Контент страницы</Layout>)

		await expect.element(view.getByRole('button', { name: 'Поддержка' })).toBeVisible()
		expect(document.querySelectorAll('button[aria-label="Поддержка"]')).toHaveLength(1)
	})

	it('иконка внутри кнопки поддержки отцентрована', async () => {
		await page.viewport(1280, 800)

		await renderWithProviders(<Layout>Контент страницы</Layout>)

		const button = document.querySelector('button[aria-label="Поддержка"]')
		const icon = button?.querySelector('svg')
		const buttonRect = button?.getBoundingClientRect()
		const iconRect = icon?.getBoundingClientRect()

		const buttonCenterX = (buttonRect?.left ?? 0) + (buttonRect?.width ?? 0) / 2
		const buttonCenterY = (buttonRect?.top ?? 0) + (buttonRect?.height ?? 0) / 2
		const iconCenterX = (iconRect?.left ?? 0) + (iconRect?.width ?? 0) / 2
		const iconCenterY = (iconRect?.top ?? 0) + (iconRect?.height ?? 0) / 2

		expect(Math.abs(buttonCenterX - iconCenterX)).toBeLessThan(1)
		expect(Math.abs(buttonCenterY - iconCenterY)).toBeLessThan(1)
	})

	it('кнопка поддержки в оболочке помечена как десктопная (hidden lg:grid)', async () => {
		await renderWithProviders(<Layout>Контент страницы</Layout>)

		const supportButton = document.querySelector('button[aria-label="Поддержка"]')

		expect(supportButton?.className).toContain('hidden')
		expect(supportButton?.className).toContain('lg:grid')
	})

	it('на мобильной ширине плавающая кнопка поддержки не видна', async () => {
		await page.viewport(390, 844)

		await renderWithProviders(<Layout>Контент страницы</Layout>)

		await expect
			.poll(() => document.querySelector('button[aria-label="Поддержка"]'))
			.toHaveProperty('offsetParent', null)
	})

	it('открывает диалог «Поддержка» по нажатию', async () => {
		await page.viewport(1280, 800)

		const view = await renderWithProviders(<Layout>Контент страницы</Layout>)

		await view.getByRole('button', { name: 'Поддержка' }).click()

		await expect.element(view.getByRole('heading', { name: 'Поддержка' })).toBeVisible()
	})
})
