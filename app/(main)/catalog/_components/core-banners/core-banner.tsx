import type { GetCores200 } from '@repo/api'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@repo/core'
import { ArrowRightIcon, CodeIcon, PaletteIcon, ServerIcon, ShipIcon } from 'lucide-react'
import Link from 'next/link'

interface CoreBannerVisuals {
	icon: LucideIcon
	iconSurface: string
	/** Заливка баннера. Классы заданы литералами, иначе Tailwind не увидит их при сборке. */
	surface: string
}

type CatalogCore = GetCores200[number]

const CORE_BANNER_VISUALS: Record<CatalogCore['icon'], CoreBannerVisuals> = {
	code: {
		icon: CodeIcon,
		surface: 'from-brand-secondary to-brand-soft',
		iconSurface: 'bg-brand-primary text-white',
	},
	server: {
		icon: ServerIcon,
		surface: 'from-emerald-100 to-teal-100',
		iconSurface: 'bg-emerald-500 text-white',
	},
	ship: {
		icon: ShipIcon,
		surface: 'from-sky-100 to-indigo-100',
		iconSurface: 'bg-sky-500 text-white',
	},
	palette: {
		icon: PaletteIcon,
		surface: 'from-rose-100 to-orange-100',
		iconSurface: 'bg-rose-500 text-white',
	},
}

interface CoreBannerProps {
	core: CatalogCore
}

export function CoreBanner({ core }: CoreBannerProps) {
	const visuals = CORE_BANNER_VISUALS[core.icon]
	const Icon = visuals.icon

	return (
		<Link href={`/catalog/${core.type}`} className={cn(`
			group flex w-full items-center gap-4 rounded-2xl bg-linear-to-br p-6
			transition-transform border-shaded
			hover:scale-[1.01]
			active:scale-[0.99]
			md:gap-6 md:p-8
		`, visuals.surface)}>
			<span className={cn(`
				flex size-12 shrink-0 items-center justify-center rounded-xl
				md:size-14
			`, visuals.iconSurface)}>
				<Icon className="size-6" aria-hidden />
			</span>

			<span className="v-stack min-w-0 flex-1 gap-1">
				<span className="flex flex-wrap items-center gap-2">
					<span className={`
						text-xl font-semibold text-brand-ink
						md:text-2xl
					`}>{core.name}</span>

					{!core.isAvailable && <span className={`
							rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium
							text-brand-ink
						`}>Раздел в разработке</span>}
				</span>

				<span className="text-sm text-brand-ink/70">{core.description}</span>
			</span>

			<ArrowRightIcon className={`
				size-5 shrink-0 text-brand-ink transition-transform
				group-hover:translate-x-1
			`} aria-hidden />
		</Link>
	)
}
