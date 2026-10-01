'use client'

import {
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
	/** Определяется на сервере, поэтому первый клиентский рендер совпадает с серверным. */
	isAuthenticated: boolean
	skillId: string
}

const label = 'Изучен'

export function SkillCompletionButton({ isAuthenticated, skillId }: SkillCompletionButtonProps) {
	const pathname = usePathname()
	const queryClient = useQueryClient()
	// Данные уже лежат в кэше после серверного прогрева, поэтому состояние кнопки верно с первого
	// рендера, без промежуточного показа противоположного.
	const { data: skill } = useGetSkillById({ id: skillId })
	const completed = skill?.completed ?? false

	const { isPending, mutate } = useSetSkillCompletion({
		mutation: {
			onSuccess: (result) => {
				queryClient.setQueryData(getSkillByIdQueryKey({ id: skillId }), (current) =>
					current == null ? current : { ...current, completed: result.completed },
				)
				// Счётчик изученных навыков на дашборде приходит отдельным запросом.
				void queryClient.invalidateQueries({ queryKey: getDashboardStatsQueryKey() })
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
		// Для гостя это именно навигация, поэтому здесь ссылка со стилями кнопки, а не кнопка:
		// `Button` Base UI отдал бы `<a role="button">` и скрыл бы переход от вспомогательных
		// технологий.
		return (
			<Link
				className={cn(buttonVariants({ variant: 'outline' }), 'w-fit gap-2')}
				href={`/sign-in?next=${encodeURIComponent(pathname)}`}
			>
				<Check className="size-4" />
				{label}
			</Link>
		)
	}

	return (
		<Button
			className="w-fit gap-2"
			variant={completed ? 'default' : 'outline'}
			aria-pressed={completed}
			// Блокировка на время запроса: одно действие пользователя не должно давать двух
			// противоположных запросов.
			disabled={isPending}
			onClick={() => {
				mutate({ id: skillId, data: { completed: !completed } })
			}}
		>
			{isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
			{label}
		</Button>
	)
}
