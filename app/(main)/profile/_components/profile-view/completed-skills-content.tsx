'use client'

import {
	getCompletedSkillsByCoreQueryKey,
	useGetAuthMe,
	useGetCompletedSkillsByCore,
} from '@repo/api'
import { Button, Skeleton } from '@repo/core'

import { CompletedSkillsGroups } from './completed-skills-groups'

export function CompletedSkillsContent() {
	const { data: user } = useGetAuthMe()
	const {
		data: groups,
		isError,
		isFetching,
		isLoading,
		refetch,
	} = useGetCompletedSkillsByCore({
		query: {
			queryKey: [...getCompletedSkillsByCoreQueryKey(), user?.id],
			enabled: user != null,
		},
	})

	if (isLoading) {
		return (
			<div className="v-stack gap-4" role="status" aria-label="Загрузка изученных навыков">
				{['first', 'second'].map((group) => (
					<div key={group} className="v-stack gap-2" aria-hidden="true">
						<Skeleton className="h-5 w-24" />
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-8 w-32 rounded-full" />
							<Skeleton className="h-8 w-40 rounded-full" />
							<Skeleton className="h-8 w-28 rounded-full" />
						</div>
					</div>
				))}
			</div>
		)
	}

	if (isError) {
		return (
			<>
				<div className="v-stack items-start gap-4" role="alert">
					<p className="text-sm text-muted-foreground">
						Не удалось обновить изученные навыки
					</p>
					<Button
						variant="outline"
						disabled={isFetching}
						onClick={() => {
							void refetch()
						}}
					>
						Попробовать ещё раз
					</Button>
				</div>
				<CompletedSkillsGroups groups={groups} />
			</>
		)
	}

	if (groups == null) {
		return null
	}

	if (groups.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Вы ещё не отметили ни одного навыка изученным
			</p>
		)
	}

	return <CompletedSkillsGroups groups={groups} />
}
