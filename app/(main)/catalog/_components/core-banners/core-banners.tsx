'use client'

import { useGetCores } from '@repo/api'

import { CoreBanner } from './core-banner'
import { CoreBannersEmpty } from './core-banners-empty'
import { CoreBannersError } from './core-banners-error'
import { CoreBannersSkeleton } from './core-banners-skeleton'

export function CoreBanners() {
	const { data: cores, isError, isLoading } = useGetCores()

	if (isLoading) {
		return <CoreBannersSkeleton />
	}

	if (isError) {
		return <CoreBannersError />
	}

	if (!cores || cores.length === 0) {
		return <CoreBannersEmpty />
	}

	return (
		<section className={`
			grid grid-cols-1 gap-4
			md:grid-cols-2
		`}>
			{cores.map((core) => (
				<CoreBanner key={core.type} core={core} />
			))}
		</section>
	)
}
