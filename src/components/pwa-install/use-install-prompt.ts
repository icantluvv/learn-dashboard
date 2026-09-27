'use client'

import { useCallback, useEffect, useState } from 'react'

import { shouldShowInstallBanner } from './should-show-install-banner'

const dismissedKey = 'pwa-install-dismissed'
/**
 * `beforeinstallprompt` fires asynchronously, sometimes well after mount. Without a grace period, a
 * browser that will fire it eventually would flash the iOS instructions first.
 */
const iosFallbackDelayMs = 1500

interface BeforeInstallPromptEvent extends Event {
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
	prompt: () => Promise<void>
}

function isStandaloneDisplay() {
	if (globalThis.window === undefined) {
		return false
	}

	return (
		globalThis.matchMedia('(display-mode: standalone)').matches ||
		(globalThis.navigator as { standalone?: boolean }).standalone === true
	)
}

function isIosSafari() {
	if (globalThis.window === undefined) {
		return false
	}

	return typeof (globalThis.navigator as { standalone?: unknown }).standalone === 'boolean'
}

function readDismissed() {
	try {
		return globalThis.localStorage.getItem(dismissedKey) != null
	} catch {
		return false
	}
}

export function useInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [isDismissed, setIsDismissed] = useState(readDismissed)
	const [isStandalone, setIsStandalone] = useState(isStandaloneDisplay)
	const [iosFallbackReady, setIosFallbackReady] = useState(false)

	useEffect(() => {
		const onBeforeInstallPrompt = (event: Event) => {
			event.preventDefault()

			setDeferredPrompt(event as BeforeInstallPromptEvent)
		}

		const onAppInstalled = () => {
			setDeferredPrompt(null)
			setIsStandalone(true)
		}

		globalThis.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
		globalThis.addEventListener('appinstalled', onAppInstalled)

		const timer = globalThis.setTimeout(() => {
			setIosFallbackReady(true)
		}, iosFallbackDelayMs)

		return () => {
			globalThis.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
			globalThis.removeEventListener('appinstalled', onAppInstalled)
			globalThis.clearTimeout(timer)
		}
	}, [])

	const dismiss = useCallback(() => {
		setIsDismissed(true)

		try {
			globalThis.localStorage.setItem(dismissedKey, String(Date.now()))
		} catch {
			// Best-effort: if storage is unavailable, the banner still hides for this session.
		}
	}, [])

	const install = useCallback(async () => {
		if (deferredPrompt == null) {
			return
		}

		await deferredPrompt.prompt()
		const { outcome } = await deferredPrompt.userChoice

		setDeferredPrompt(null)

		if (outcome === 'dismissed') {
			dismiss()
		}
	}, [deferredPrompt, dismiss])

	const mode = shouldShowInstallBanner({
		hasInstallPrompt: deferredPrompt != null,
		isDismissed,
		isIosSafari: iosFallbackReady && isIosSafari(),
		isStandalone,
	})

	return { dismiss, install, mode }
}
