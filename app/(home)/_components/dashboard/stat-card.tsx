import { Card, CardContent } from '@repo/core'

interface StatCardProps {
	label: string
	value: number
}

export function StatCard({ label, value }: StatCardProps) {
	return (
		<Card
			className="rounded-2xl shadow-none ring-0 border-shaded"
			role="group"
			aria-label={label}
		>
			<CardContent className="v-stack gap-1">
				<span className="text-sm text-muted-foreground">{label}</span>
				<span className="text-3xl font-semibold">{value}</span>
			</CardContent>
		</Card>
	)
}
