'use client'

import type { GetSkills200 } from '@repo/api'

import { useGetSkills } from '@repo/api'
import Link from 'next/link'

import { DIFFICULTY_OPTIONS } from '#/constants/difficulty-options'
import { computeCatalogStats } from '@/(main)/(home)/_utils/compute-catalog-stats'

import { DashboardEmpty } from './dashboard-empty'
import { DashboardError } from './dashboard-error'
import { DashboardSkeleton } from './dashboard-skeleton'
import { StatCard } from './stat-card'

export function Dashboard() {
	const { data: skills, isError, isLoading } = useGetSkills()

	return (
		<div className="v-stack gap-8">
			<section className="v-stack gap-2">
				<h1 className="text-3xl font-semibold">Learn Frontend</h1>
				<p className="text-base text-muted-foreground">
					Сервис для подготовки по фронтенду: навыки, разбитые по темам и уровням
					сложности, с вопросами для самопроверки.
				</p>
				<Link href="/catalog" className="w-fit text-base underline">
					Перейти в каталог
				</Link>
			</section>

			{isLoading ? (
				<DashboardSkeleton />
			) : isError ? (
				<DashboardError />
			) : !skills || skills.length === 0 ? (
				<DashboardEmpty />
			) : (
				<DashboardStats skills={skills} />
			)}
		</div>
	)
}

function DashboardStats({ skills }: { skills: GetSkills200 }) {
	const stats = computeCatalogStats(skills)

	return (
		<div className="v-stack gap-4">
			<div className={`
				grid grid-cols-1 gap-4
				sm:grid-cols-3
			`}>
				<StatCard label="Навыков" value={stats.skillsCount} />
				<StatCard label="Тем" value={stats.topicsCount} />
				<StatCard label="Вопросов" value={stats.questionsCount} />
			</div>

			<div className={`
				grid grid-cols-1 gap-4
				sm:grid-cols-3
			`}>
				{DIFFICULTY_OPTIONS.map((option) => (
					<StatCard
						key={option.id}
						label={option.label}
						value={stats.byDifficulty[option.id]}
					/>
				))}
			</div>
		</div>
	)
}
