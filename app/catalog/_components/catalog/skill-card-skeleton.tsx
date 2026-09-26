import { Skeleton } from '@repo/core'

export function SkillCardSkeleton() {
	return (
		<div className="v-stack size-full gap-3 rounded-xl p-4 border-shaded">
			<div className="flex items-center justify-between gap-2">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-4 w-14" />
			</div>

			<Skeleton className="h-8 w-3/4" />
			<Skeleton className="h-5 w-24" />
		</div>
	)
}
