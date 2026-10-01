import type { Metadata } from 'next'

import { getSkillsQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { resolveSkillCore } from '#/constants/skill-cores'
import { getCoreByType } from '#/modules/cores/server/cores-repository'
import { getSkills } from '#/modules/skills/server/skills-repository'
import { buildPageMetadata, getCoreSeoCopy } from '#/seo'
import { getQueryClient } from '#/utils/get-query-client'
import { Catalog } from '@/(main)/catalog/[core]/_components/catalog'
import { CorePlaceholder } from '@/(main)/catalog/[core]/_components/core-placeholder'
import { SidebarFilters } from '@/(main)/catalog/[core]/_components/sidebar-filters'

interface CatalogCorePageProps {
	params: Promise<{ core: string }>
}

export async function generateMetadata({ params }: CatalogCorePageProps): Promise<Metadata> {
	const { core: coreSegment } = await params
	const core = resolveSkillCore(coreSegment)

	if (core == null) {
		notFound()
	}

	const { description, title } = getCoreSeoCopy(core)

	return buildPageMetadata({ title, description, path: `/catalog/${core}` })
}

export default async function CatalogCorePage({ params }: CatalogCorePageProps) {
	const { core: coreSegment } = await params
	const core = resolveSkillCore(coreSegment)

	if (core == null) {
		notFound()
	}

	const coreData = await getCoreByType(core)

	if (coreData == null) {
		notFound()
	}

	if (!coreData.isAvailable) {
		return (
			<div className="page-wrapper v-stack">
				<CorePlaceholder core={coreData} />
			</div>
		)
	}

	const queryClient = getQueryClient()

	try {
		const skills = await getSkills({ core })
		queryClient.setQueryData(getSkillsQueryOptions({ params: { core } }).queryKey, skills)
	} catch {}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className={`
				page-wrapper v-stack gap-4
				md:flex-row md:gap-12
			`}>
				<SidebarFilters />
				<Catalog core={core} />
			</div>
		</HydrationBoundary>
	)
}
