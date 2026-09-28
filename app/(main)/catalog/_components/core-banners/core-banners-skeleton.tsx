import { CoreBannerSkeleton } from './core-banner-skeleton'

const SKELETON_IDS = ['a', 'b', 'c', 'd']

export function CoreBannersSkeleton() {
	return (
		<section className="v-stack gap-4" aria-label="Загружаем направления">
			{SKELETON_IDS.map((id) => (
				<CoreBannerSkeleton key={id} />
			))}
		</section>
	)
}
