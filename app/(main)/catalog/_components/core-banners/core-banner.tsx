import type { GetCores200 } from '@repo/api'

import Image from 'next/image'
import Link from 'next/link'

type CatalogCore = GetCores200[number]

const CORE_BANNER_IMAGES: Record<CatalogCore['type'], string> = {
	frontend: '/banners/front-end.webp',
	backend: '/banners/back-end-2.webp',
	devops: '/banners/devops-2.webp',
	design: '/banners/design.webp',
}

interface CoreBannerProps {
	core: CatalogCore
}

export function CoreBanner({ core }: CoreBannerProps) {
	return (
		<Link href={`/catalog/${core.type}`} className={`
			group relative flex h-40 w-full interactive-scale items-end overflow-hidden rounded-2xl
			p-6
			md:h-64 md:p-8
			lg:h-70
		`}>
			<Image
				src={CORE_BANNER_IMAGES[core.type]}
				alt=""
				sizes="(max-width: 768px) 100vw, (max-width: 1024px) 840px, 1400px"
				quality={100}
				className={`
					object-cover transition-transform duration-300
					group-hover:scale-105
				`}
				fill
				aria-hidden
			/>

			<span className="relative v-stack flex-col-reverse items-start gap-2">
				{!core.isAvailable && <span className={`
					rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-brand-ink
				`}>Раздел в разработке</span>}

				<span className={`
					text-2xl font-semibold text-brand-ink
					md:text-4xl
				`}>{core.name}</span>
			</span>
		</Link>
	)
}
