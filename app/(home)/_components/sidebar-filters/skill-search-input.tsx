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
			<SearchField.Group className="base-input">
				<SearchField.SearchIcon />
				<SearchField.Input placeholder="Поиск по названию" />
				<SearchField.ClearButton />
			</SearchField.Group>
		</SearchField>
	)
}
