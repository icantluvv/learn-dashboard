import { Skeleton } from '@repo/core'

const SKELETON_IDS = ['a', 'b', 'c', 'd']

export function DashboardSkeleton() {
	return (
		<div className={`
			grid grid-cols-1 gap-4
			sm:grid-cols-2
			lg:grid-cols-4
		`}>
			{SKELETON_IDS.map((id) => (
				<div key={id} className="v-stack gap-2 rounded-2xl p-6 border-shaded">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-8 w-16" />
				</div>
			))}
		</div>
	)
}
