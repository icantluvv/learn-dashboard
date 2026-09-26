'use client'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@repo/core'
import { SearchIcon, XIcon } from 'lucide-react'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

export function SkillSearchInput() {
	const [{ search }, setFilters] = useSkillsFilters()

	return (
		<InputGroup>
			<InputGroupAddon>
				<SearchIcon />
			</InputGroupAddon>

			<InputGroupInput
				aria-label="Поиск по названию"
				placeholder="Поиск по названию"
				value={search ?? ''}
				onChange={(event) => {
					const { value } = event.target

					void setFilters({ search: value === '' ? null : value })
				}}
			/>

			{search !== null && search !== '' && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label="Очистить поиск"
						size="icon-xs"
						onClick={() => {
							void setFilters({ search: null })
						}}
					>
						<XIcon />
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	)
}
