'use client'

import { Button } from '@heroui/react'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

export function ResetFiltersButton() {
	const [, setFilters] = useSkillsFilters()

	return (
		<Button
			className="h-12 rounded-lg text-base font-medium text-black"
			variant="outline"
			fullWidth
			onPress={() => {
				void setFilters(null)
			}}
		>
			Сбросить фильтры
		</Button>
	)
}
