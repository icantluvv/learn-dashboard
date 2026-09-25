import type { GetSkillById200 } from '@repo/api'

import { getSkillByIdQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

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

	let skill: GetSkillById200

	try {
		skill = await queryClient.query(getSkillByIdQueryOptions({ id }))
	} catch (error) {
		if (
			error instanceof Error &&
			(error.cause as { status?: number } | undefined)?.status === 404
		) {
			notFound()
		}

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
