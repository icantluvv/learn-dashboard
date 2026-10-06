'use client'

import type { ReactElement } from 'react'

import {
	buttonVariants,
	cn,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/core'
import { MailIcon } from 'lucide-react'

import { TelegramIcon } from '#/components/support/telegram-icon'
import { SUPPORT_MAILTO_URL, SUPPORT_TELEGRAM_URL } from '#/constants/support'

export function SupportDialog({ trigger }: { trigger: ReactElement }) {
	return (
		<Dialog>
			<DialogTrigger render={trigger} />

			<DialogContent className="bg-background text-foreground">
				<DialogHeader>
					<DialogTitle>Поддержка</DialogTitle>
					<DialogDescription>
						Вы можете обратиться с проблемой или пожеланием для доработки сервиса
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<a
						href={SUPPORT_MAILTO_URL}
						className={cn(buttonVariants({ variant: 'default' }), `
								bg-brand-primary text-white
								hover:bg-brand-primary/90
								active:bg-brand-primary/80
							`)}
					>
						Почта
						<MailIcon aria-hidden="true" />
					</a>

					<a
						href={SUPPORT_TELEGRAM_URL}
						target="_blank"
						rel="noreferrer nofollow"
						className={cn(buttonVariants({ variant: 'outline' }))}
					>
						Telegram
						<TelegramIcon />
					</a>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
