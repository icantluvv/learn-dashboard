import { Skeleton } from '@repo/core'

export function ProfileLoading() {
	return (
		<div className="v-stack items-center gap-4">
			<Skeleton className="size-20 rounded-full" />
			<Skeleton className="h-4 w-40" />
			<Skeleton className="h-4 w-56" />
		</div>
	)
}
