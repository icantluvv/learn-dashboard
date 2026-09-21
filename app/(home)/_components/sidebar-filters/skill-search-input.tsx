'use client'

import { SearchField } from '@heroui/react'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

export function SkillSearchInput() {
	const [{ search }, setFilters] = useSkillsFilters()

	return (
		<SearchField
			aria-label="Поиск по названию"
			value={search ?? ''}
			onChange={(value) => {
				void setFilters({ search: value === '' ? null : value })
			}}
		>
			<SearchField.Group className="h-12 rounded-2xl border-shaded">
				<SearchField.SearchIcon />
				<SearchField.Input placeholder="Поиск по названию" />
				<SearchField.ClearButton />
			</SearchField.Group>
		</SearchField>
	)
}
