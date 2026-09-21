'use client'

import { ListBox, Select } from '@heroui/react'

import { DIFFICULTY_OPTIONS } from '../../_constants/difficulty-options'
import { useSkillsFilters } from '../../_hooks/use-skills-filters'

export function DifficultySelect() {
	const [{ difficulty }, setFilters] = useSkillsFilters()

	return (
		<Select
			aria-label="Сложность"
			placeholder="Сложность"
			value={difficulty}
			onChange={(key) => {
				void setFilters({
					difficulty: key as (typeof DIFFICULTY_OPTIONS)[number]['id'] | null,
				})
			}}
		>
			<Select.Trigger className="h-12 items-center rounded-2xl border-shaded">
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>

			<Select.Popover>
				<ListBox>
					{DIFFICULTY_OPTIONS.map((option) => (
						<ListBox.Item key={option.id} id={option.id}>
							{option.label}
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}
