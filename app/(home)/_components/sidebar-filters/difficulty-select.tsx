'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/core'

import { DIFFICULTY_OPTIONS } from '../../_constants/difficulty-options'
import { useSkillsFilters } from '../../_hooks/use-skills-filters'

type DifficultyValue = (typeof DIFFICULTY_OPTIONS)[number]['id']

export function DifficultySelect() {
	const [{ difficulty }, setFilters] = useSkillsFilters()

	return (
		<Select
			value={difficulty}
			onValueChange={(value: DifficultyValue | null) => {
				void setFilters({ difficulty: value })
			}}
		>
			<SelectTrigger aria-label="Сложность" className="w-full">
				<SelectValue>
					{(value: DifficultyValue | null) =>
						DIFFICULTY_OPTIONS.find((option) => option.id === value)?.label ??
						'Сложность'
					}
				</SelectValue>
			</SelectTrigger>

			<SelectContent>
				{DIFFICULTY_OPTIONS.map((option) => (
					<SelectItem key={option.id} value={option.id}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
