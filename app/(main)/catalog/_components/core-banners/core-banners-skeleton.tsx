import { CoreBannerSkeleton } from './core-banner-skeleton'

const SKELETON_IDS = ['a', 'b', 'c', 'd']

export function CoreBannersSkeleton() {
	return (
		<section className={`
			grid grid-cols-1 gap-4
			md:grid-cols-2
		`} aria-label="Загружаем направления">
			{SKELETON_IDS.map((id) => (
				<CoreBannerSkeleton key={id} />
			))}
		</section>
	)
}
