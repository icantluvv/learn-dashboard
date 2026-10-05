'use client'

import { Button, toast, Tooltip, TooltipContent, TooltipTrigger } from '@repo/core'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyQuestionButtonProps {
	question: string
}

const tooltipLabel = 'копировать вопрос'
const iconClassName = 'size-4 transition-transform group-active/button:scale-75'

export function CopyQuestionButton({ question }: CopyQuestionButtonProps) {
	const [isCopied, setIsCopied] = useState(false)

	async function copyQuestion() {
		try {
			await navigator.clipboard.writeText(question)
			setIsCopied(true)
			toast.add({ title: 'Вопрос скопирован' })
		} catch {
			toast.add({ title: 'Не удалось скопировать вопрос' })
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						aria-label={tooltipLabel}
						className={`
							shrink-0 text-muted-foreground
							hover:bg-transparent hover:text-foreground
							dark:hover:bg-transparent
						`}
						size="icon-sm"
						variant="ghost"
						onClick={() => {
							void copyQuestion()
						}}
					>
						{isCopied ? (
							<Check className={iconClassName} />
						) : (
							<Copy className={iconClassName} />
						)}
					</Button>
				}
			/>

			<TooltipContent>{tooltipLabel}</TooltipContent>
		</Tooltip>
	)
}
