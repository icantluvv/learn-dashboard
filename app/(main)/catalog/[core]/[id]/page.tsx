import { getSkillByIdQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { resolveSkillCore } from '#/constants/skill-cores'
import { getSkillById } from '#/modules/skills/server/skills-repository'
import { getQueryClient } from '#/utils/get-query-client'
import {
	BackButton,
	SkillDetailContent,
	SkillDetailError,
} from '@/(main)/catalog/[core]/[id]/_components/skill-detail'

import { isSkillInCore } from './skill-route'

interface CatalogSkillPageProps {
	params: Promise<{ core: string; id: string }>
}

export default async function CatalogSkillPage({ params }: CatalogSkillPageProps) {
	const { core: coreSegment, id } = await params
	const core = resolveSkillCore(coreSegment)

	if (core == null) {
		notFound()
	}

	const queryClient = getQueryClient()

	let skill: Awaited<ReturnType<typeof getSkillById>>

	try {
		skill = await getSkillById(id)
	} catch {
		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<div className={`
					page-wrapper v-stack gap-12
					md:flex-row
				`}>
					<SkillDetailError />
				</div>
			</HydrationBoundary>
		)
	}

	// Навык доступен только по адресу собственного направления: иначе один и тот же навык
	// открывался бы по четырём адресам, а чужой раздел показывал бы чужие навыки.
	if (skill == null || !isSkillInCore(skill.core, core)) {
		notFound()
	}

	queryClient.setQueryData(getSkillByIdQueryOptions({ id }).queryKey, skill)

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className={`
				page-wrapper v-stack gap-12
				md:flex-row
			`}>
				<div className="v-stack min-w-0 flex-1 gap-4">
					<BackButton />
					<SkillDetailContent skill={skill} />
				</div>
			</div>
		</HydrationBoundary>
	)
}
