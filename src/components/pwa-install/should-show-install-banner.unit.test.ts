import type { InstallBannerState } from './should-show-install-banner'

import { describe, expect, it } from 'vitest'

import { shouldShowInstallBanner } from './should-show-install-banner'

const base: InstallBannerState = {
	hasInstallPrompt: false,
	isDismissed: false,
	isIosSafari: false,
	isStandalone: false,
}

describe('shouldShowInstallBanner', () => {
	it('shows the native prompt when the browser fired beforeinstallprompt', () => {
		expect(shouldShowInstallBanner({ ...base, hasInstallPrompt: true })).toBe('prompt')
	})

	it('shows iOS instructions when there is no prompt but the browser is iOS Safari', () => {
		expect(shouldShowInstallBanner({ ...base, isIosSafari: true })).toBe('ios-instructions')
	})

	it('prefers the native prompt over iOS instructions when both apply', () => {
		expect(
			shouldShowInstallBanner({ ...base, hasInstallPrompt: true, isIosSafari: true }),
		).toBe('prompt')
	})

	it('hides everything when nothing applies', () => {
		expect(shouldShowInstallBanner(base)).toBe('hidden')
	})

	it('hides the prompt when already running standalone', () => {
		expect(
			shouldShowInstallBanner({ ...base, hasInstallPrompt: true, isStandalone: true }),
		).toBe('hidden')
	})

	it('hides iOS instructions when already running standalone', () => {
		expect(shouldShowInstallBanner({ ...base, isIosSafari: true, isStandalone: true })).toBe(
			'hidden',
		)
	})

	it('hides the prompt once the user dismissed the banner', () => {
		expect(
			shouldShowInstallBanner({ ...base, hasInstallPrompt: true, isDismissed: true }),
		).toBe('hidden')
	})

	it('hides iOS instructions once the user dismissed the banner', () => {
		expect(shouldShowInstallBanner({ ...base, isIosSafari: true, isDismissed: true })).toBe(
			'hidden',
		)
	})

	it('standalone wins even when the user never dismissed anything', () => {
		expect(
			shouldShowInstallBanner({
				hasInstallPrompt: true,
				isDismissed: false,
				isIosSafari: true,
				isStandalone: true,
			}),
		).toBe('hidden')
	})
})
