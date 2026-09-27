import type { LucideIcon } from 'lucide-react'

import { Card, CardContent, CircularProgress } from '@repo/core'

interface StatCardProgress {
	total: number
	value: number
}

interface StatCardProps {
	icon?: LucideIcon
	label: string
	progress?: StatCardProgress
	value: number
}

export function StatCard({ icon: Icon, label, progress, value }: StatCardProps) {
	const progressPercent =
		progress != null && progress.total > 0
			? Math.round((progress.value / progress.total) * 100)
			: 0

	return (
		<Card
			className="rounded-2xl shadow-none ring-0 border-shaded"
			role="group"
			aria-label={label}
		>
			<CardContent className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					{Icon ? (
						<span className={`
							flex size-10 shrink-0 items-center justify-center rounded-full
							bg-brand-soft text-brand-primary
						`}>
							<Icon className="size-5" aria-hidden="true" />
						</span>
					) : null}
					<div className="v-stack gap-1">
						<span className="text-sm text-muted-foreground">{label}</span>
						<span className="text-3xl font-semibold">{value}</span>
					</div>
				</div>

				{progress != null ? (
					<div className="relative flex shrink-0 items-center justify-center">
						<CircularProgress
							value={progressPercent}
							size={48}
							strokeWidth={5}
							aria-label={`Выполнено: ${label}`}
						/>
						<span className="absolute text-xs font-semibold text-brand-ink">
							{progressPercent}%
						</span>
					</div>
				) : null}
			</CardContent>
		</Card>
	)
}
