import { Skeleton } from '@repo/core'

export function CoreBannerSkeleton() {
	return (
		<div className={`
			flex w-full items-center gap-4 rounded-2xl bg-card p-6 border-shaded
			md:gap-6 md:p-8
		`}>
			<Skeleton className={`
				size-12 shrink-0 rounded-xl
				md:size-14
			`} />

			<div className="v-stack min-w-0 flex-1 gap-2">
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-4 w-3/4" />
			</div>

			<Skeleton className="size-5 shrink-0 rounded-full" />
		</div>
	)
}
