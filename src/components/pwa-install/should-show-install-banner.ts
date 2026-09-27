export interface InstallBannerState {
	hasInstallPrompt: boolean
	isDismissed: boolean
	isIosSafari: boolean
	isStandalone: boolean
}

export type InstallBannerMode = 'hidden' | 'ios-instructions' | 'prompt'

export function shouldShowInstallBanner(state: InstallBannerState): InstallBannerMode {
	if (state.isStandalone || state.isDismissed) {
		return 'hidden'
	}

	if (state.hasInstallPrompt) {
		return 'prompt'
	}

	if (state.isIosSafari) {
		return 'ios-instructions'
	}

	return 'hidden'
}
