import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { PwaInstallBanner } from './pwa-install-banner'

class FakeBeforeInstallPromptEvent extends Event {
	promptCalls = 0
	resolveUserChoice: ((outcome: 'accepted' | 'dismissed') => void) | undefined
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>

	constructor() {
		super('beforeinstallprompt', { cancelable: true })
		this.userChoice = new Promise((resolve) => {
			this.resolveUserChoice = (outcome) => resolve({ outcome })
		})
	}

	async prompt() {
		this.promptCalls += 1
	}
}

function mockStandalone(matches: boolean) {
	vi.stubGlobal('matchMedia', (query: string) => ({
		matches: query === '(display-mode: standalone)' && matches,
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {},
	}))
}

function mockIosSafari(isIos: boolean) {
	Object.defineProperty(globalThis.navigator, 'standalone', {
		configurable: true,
		value: isIos ? false : undefined,
	})
}

describe('<PwaInstallBanner />', () => {
	beforeEach(() => {
		globalThis.localStorage.clear()
		mockStandalone(false)
		mockIosSafari(false)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		Reflect.deleteProperty(globalThis.navigator, 'standalone')
	})

	it('вызывает сохранённый промпт по клику на кнопку установки', async () => {
		const view = await render(<PwaInstallBanner />)
		const event = new FakeBeforeInstallPromptEvent()

		globalThis.dispatchEvent(event)

		const install = view.getByRole('button', { name: 'Установить' })
		await expect.element(install).toBeVisible()

		await install.click()

		expect(event.promptCalls).toBe(1)
	})

	it('закрывает баннер по кнопке и запоминает отказ', async () => {
		const view = await render(<PwaInstallBanner />)

		globalThis.dispatchEvent(new FakeBeforeInstallPromptEvent())
		await expect.element(view.getByRole('dialog')).toBeVisible()

		await view.getByRole('button', { name: 'Закрыть' }).click()

		await expect.element(view.getByRole('dialog')).not.toBeInTheDocument()
		expect(globalThis.localStorage.getItem('pwa-install-dismissed')).not.toBeNull()
	})

	it('показывает инструкцию для iOS Safari вместо кнопки установки', async () => {
		mockIosSafari(true)

		const view = await render(<PwaInstallBanner />)

		await vi.waitFor(
			async () => {
				await expect.element(view.getByText('Поделиться', { exact: false })).toBeVisible()
			},
			{ timeout: 3000 },
		)
		await expect
			.element(view.getByRole('button', { name: 'Установить' }))
			.not.toBeInTheDocument()
	})

	it('не рендерит ничего в установленном приложении', async () => {
		mockStandalone(true)

		const view = await render(<PwaInstallBanner />)

		globalThis.dispatchEvent(new FakeBeforeInstallPromptEvent())

		await expect.element(view.getByRole('dialog')).not.toBeInTheDocument()
	})

	it('скрывает баннер, когда пользователь отклоняет системный диалог', async () => {
		const view = await render(<PwaInstallBanner />)
		const event = new FakeBeforeInstallPromptEvent()

		globalThis.dispatchEvent(event)
		await view.getByRole('button', { name: 'Установить' }).click()
		event.resolveUserChoice?.('dismissed')

		await expect.element(view.getByRole('dialog')).not.toBeInTheDocument()
	})

	it('скрыт на десктопной ширине через lg:hidden', async () => {
		const view = await render(<PwaInstallBanner />)

		globalThis.dispatchEvent(new FakeBeforeInstallPromptEvent())

		await expect.element(view.getByRole('dialog')).toHaveClass(/lg:hidden/)
	})
})
