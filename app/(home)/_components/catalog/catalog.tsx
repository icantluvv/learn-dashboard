'use client'

import { useGetSkills } from '@repo/api'

import { toSkillsQueryParams, useSkillsFilters } from '../../_hooks/use-skills-filters'
import { CatalogEmpty } from './catalog-empty'
import { CatalogError } from './catalog-error'
import { CatalogSkeleton } from './catalog-skeleton'
import { SkillCard } from './skill-card'

export function Catalog() {
	const [filters] = useSkillsFilters()
	const params = toSkillsQueryParams(filters)
	const { data: skills, isError, isLoading } = useGetSkills({ params })

	if (isLoading) {
		return <CatalogSkeleton />
	}

	if (isError) {
		return <CatalogError />
	}

	if (!skills || skills.length === 0) {
		return <CatalogEmpty />
	}

	return (
		<section className="min-w-0 flex-1 rounded-xl">
			<div className={`
       grid grid-cols-1 gap-4
       sm:grid-cols-2
       lg:gap-6
   `}>
				{skills.map((skill) => (
					<SkillCard key={skill.id} skill={skill} />
				))}
			</div>
		</section>
	)
}
