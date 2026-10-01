import { Skeleton } from '@repo/core'

export function CoreBannerSkeleton() {
	return (
		<div className={`
			relative flex h-40 w-full items-end overflow-hidden rounded-2xl p-6 border-shaded
			md:h-64 md:p-8
			lg:h-96
		`}>
			<Skeleton className="absolute inset-0 rounded-none" />

			<Skeleton className={`
				relative h-8 w-48
				md:h-10 md:w-64
			`} />
		</div>
	)
}
