import { SkillCardSkeleton } from './skill-card-skeleton'

const SKELETON_IDS = ['a', 'b', 'c', 'd', 'e', 'f']

export function CatalogSkeleton() {
	return (
		<section className="min-w-0 flex-1 rounded-xl">
			<div className={`
				grid grid-cols-1 gap-4
				sm:grid-cols-2
				lg:gap-6
			`}>
				{SKELETON_IDS.map((id) => (
					<SkillCardSkeleton key={id} />
				))}
			</div>
		</section>
	)
}
