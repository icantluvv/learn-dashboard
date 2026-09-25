import { getSkillByIdQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { getSkillById } from '#/modules/skills/server/skills-repository'
import { getQueryClient } from '#/utils/get-query-client'
import {
	BackButton,
	SkillDetailContent,
	SkillDetailError,
} from '@/catalog/[id]/_components/skill-detail'

interface CatalogSkillPageProps {
	params: Promise<{ id: string }>
}

export default async function CatalogSkillPage({ params }: CatalogSkillPageProps) {
	const { id } = await params
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

	if (skill == null) {
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
