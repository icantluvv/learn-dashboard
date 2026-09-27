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
			fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 rounded-xl border
			border-border bg-card p-4 pt-[max(1rem,env(safe-area-inset-top))] text-card-foreground
			shadow-lg
			lg:hidden
		`}>
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="Закрыть"
				className="absolute top-3 right-3"
				onClick={dismiss}
			>
				<XIcon />
			</Button>

			<div className="v-stack gap-1 pr-8">
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
			</div>

			{mode === 'prompt' ? (
				<Button
					className="mt-3 w-full"
					onClick={() => {
						void install()
					}}
				>
					Установить
				</Button>
			) : null}
		</div>
	)
}
