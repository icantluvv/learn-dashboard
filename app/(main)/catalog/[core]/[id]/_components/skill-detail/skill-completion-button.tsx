'use client'

import {
	getCompletedSkillsByCoreQueryKey,
	getDashboardStatsQueryKey,
	getSkillByIdQueryKey,
	useGetSkillById,
	useSetSkillCompletion,
} from '@repo/api'
import { Button, buttonVariants, cn, Spinner, toast } from '@repo/core'
import { useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SkillCompletionButtonProps {
	isAuthenticated: boolean
	skillId: string
}

const buttonWidthClassName = 'w-full gap-2 md:w-fit'

const completedClassName = `
	bg-brand-primary
	hover:bg-brand-primary/90
	active:bg-brand-primary/90
`

export function SkillCompletionButton({ isAuthenticated, skillId }: SkillCompletionButtonProps) {
	const pathname = usePathname()
	const queryClient = useQueryClient()
	const { data: skill } = useGetSkillById({ id: skillId })
	const completed = skill?.completed ?? false
	const label = completed ? 'Изучен' : 'Изучить'

	const { isPending, mutate } = useSetSkillCompletion({
		mutation: {
			onSuccess: (result) => {
				queryClient.setQueryData(getSkillByIdQueryKey({ id: skillId }), (current) =>
					current == null ? current : { ...current, completed: result.completed },
				)
				void queryClient.invalidateQueries({ queryKey: getDashboardStatsQueryKey() })
				void queryClient.invalidateQueries({ queryKey: getCompletedSkillsByCoreQueryKey() })
			},
			onError: () => {
				toast.add({
					title: 'Не удалось сохранить отметку',
					description: 'Попробуйте ещё раз',
				})
			},
		},
	})

	if (!isAuthenticated) {
		return (
			<Link
				className={cn(buttonVariants({ variant: 'outline' }), buttonWidthClassName)}
				href={`/sign-in?next=${encodeURIComponent(pathname)}`}
			>
				{label}
			</Link>
		)
	}

	return (
		<Button
			className={cn(buttonWidthClassName, completed && completedClassName)}
			variant={completed ? 'default' : 'outline'}
			aria-pressed={completed}
			disabled={isPending}
			onClick={() => {
				mutate({ id: skillId, data: { completed: !completed } })
			}}
		>
			{label}
			{isPending ? (
				<Spinner className="size-4" />
			) : completed ? (
				<Check className="size-4" />
			) : null}
		</Button>
	)
}
