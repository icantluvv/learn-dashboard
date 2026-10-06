'use client'

import type { ReactElement } from 'react'

import {
	buttonVariants,
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

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Поддержка</DialogTitle>
					<DialogDescription>
						Вы можете обратиться с проблемой или пожеланием для доработки сервиса
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<a href={SUPPORT_MAILTO_URL} className={buttonVariants({ variant: 'default' })}>
						<MailIcon aria-hidden="true" />
						Почта
					</a>

					<a
						href={SUPPORT_TELEGRAM_URL}
						target="_blank"
						rel="noreferrer nofollow"
						className={buttonVariants({ variant: 'outline' })}
					>
						<TelegramIcon />
						Telegram
					</a>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
