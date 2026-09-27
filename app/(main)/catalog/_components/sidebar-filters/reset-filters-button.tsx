'use client'

import { Button } from '@repo/core'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

export function ResetFiltersButton() {
	const [, setFilters] = useSkillsFilters()

	return (
		<Button
			className="h-12 w-full rounded-lg text-base font-medium"
			variant="outline"
			onClick={() => {
				void setFilters(null)
			}}
		>
			Сбросить фильтры
		</Button>
	)
}
