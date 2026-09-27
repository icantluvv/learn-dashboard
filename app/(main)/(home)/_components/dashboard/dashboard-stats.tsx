import type { GetDashboardStats200 } from '@repo/api'

import { BookOpen, HelpCircle, Layers } from 'lucide-react'

import { StatCard } from './stat-card'

interface DashboardStatsProps {
	isAuthenticated: boolean
	stats: GetDashboardStats200
}

export function DashboardStats({ isAuthenticated, stats }: DashboardStatsProps) {
	return (
		<div className={`
			grid grid-cols-1 gap-4
			sm:grid-cols-3
		`}>
			<StatCard
				label="Навыков"
				value={stats.skillsCount}
				icon={Layers}
				progress={
					isAuthenticated
						? { value: stats.completedSkillsCount ?? 0, total: stats.skillsCount }
						: undefined
				}
			/>
			<StatCard label="Тем" value={stats.topicsCount} icon={BookOpen} />
			<StatCard label="Вопросов" value={stats.questionsCount} icon={HelpCircle} />
		</div>
	)
}
