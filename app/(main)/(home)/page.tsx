import { getSkillsQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { getSkills } from '#/modules/skills/server/skills-repository'
import { getQueryClient } from '#/utils/get-query-client'
import { Dashboard } from '@/(main)/(home)/_components/dashboard'

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
			<div className="page-wrapper">
				<Dashboard />
			</div>
		</HydrationBoundary>
	)
}
