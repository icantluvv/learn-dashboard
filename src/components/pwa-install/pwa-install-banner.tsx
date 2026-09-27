'use client'

import { Button } from '@repo/core'
import { XIcon } from 'lucide-react'

import { useInstallPrompt } from './use-install-prompt'

export function PwaInstallBanner() {
	const { dismiss, install, mode } = useInstallPrompt()

	if (mode === 'hidden') {
		return null
	}

	return (
		<div role="dialog" aria-label="Установка приложения" className={`
			fixed inset-x-3 bottom-[max(4.75rem,calc(4.125rem+env(safe-area-inset-bottom)))] z-30
			flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground
			shadow-lg
			lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-80
		`}>
			<div className="v-stack min-w-0 flex-1 gap-1">
				<p className="text-sm font-semibold text-heading">Установите приложение</p>

				{mode === 'prompt' ? (
					<p className="text-sm text-muted-foreground">
						Добавьте Learn Frontend на домашний экран для быстрого доступа.
					</p>
				) : (
					<p className="text-sm text-muted-foreground">
						Нажмите «Поделиться», затем «На экран Домой», чтобы добавить приложение.
					</p>
				)}

				{mode === 'prompt' ? (
					<Button
						className="mt-2 w-fit"
						onClick={() => {
							void install()
						}}
					>
						Установить
					</Button>
				) : null}
			</div>

			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="Закрыть"
				className="shrink-0"
				onClick={dismiss}
			>
				<XIcon />
			</Button>
		</div>
	)
}
