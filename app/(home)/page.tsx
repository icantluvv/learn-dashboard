import { getSkillsQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getQueryClient } from '#/utils/get-query-client'
import { Catalog } from '@/(home)/_components/catalog'
import { SidebarFilters } from '@/(home)/_components/sidebar-filters'

export default async function Home() {
	const queryClient = getQueryClient()
	await queryClient.query(getSkillsQueryOptions()).catch(() => undefined)

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
