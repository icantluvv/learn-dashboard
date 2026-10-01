'use client'

import { Button, toast, Tooltip, TooltipContent, TooltipTrigger } from '@repo/core'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyQuestionButtonProps {
	question: string
}

const tooltipLabel = 'копировать вопрос'

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
						className="shrink-0 text-muted-foreground"
						size="icon-sm"
						variant="ghost"
						onClick={() => {
							void copyQuestion()
						}}
					>
						{isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
					</Button>
				}
			/>

			<TooltipContent>{tooltipLabel}</TooltipContent>
		</Tooltip>
	)
}
