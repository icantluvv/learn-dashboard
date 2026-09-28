import type { GetCores200 } from '@repo/api'

interface CorePlaceholderProps {
	core: GetCores200[number]
}

export function CorePlaceholder({ core }: CorePlaceholderProps) {
	return (
		<section className={`
			v-stack min-h-[60vh] min-w-0 flex-1 items-center justify-center gap-2 text-center
		`}>
			<h1 className="text-2xl font-semibold text-heading">Раздел в разработке</h1>
			<p className="text-base text-muted-foreground">
				{core.name}: {core.description}
			</p>
		</section>
	)
}
