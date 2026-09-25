import { getSkillsQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getSkills } from '#/modules/skills/server/skills-repository'
import { getQueryClient } from '#/utils/get-query-client'
import { Catalog } from '@/(home)/_components/catalog'
import { SidebarFilters } from '@/(home)/_components/sidebar-filters'

export default async function Home() {
	const queryClient = getQueryClient()

	try {
		const skills = await getSkills()
		queryClient.setQueryData(getSkillsQueryOptions().queryKey, skills)
	} catch {
		// SSR warm-up is best-effort — the client hook fetches on hydration if this fails.
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className={`
				page-wrapper v-stack gap-12
				md:flex-row
			`}>
				<SidebarFilters />
				<Catalog />
			</div>
		</HydrationBoundary>
	)
}
