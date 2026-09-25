'use client'

import { ListBox, Select } from '@heroui/react'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

const TOPIC_OPTIONS = [
	'JavaScript',
	'TypeScript',
	'React',
	'Next.js',
	'Vue',
	'State Management',
	'Браузер и веб-платформа',
	'Безопасность',
	'Тестирование',
	'Сеть и протоколы',
	'Архитектура и паттерны',
	'Инструменты и сборка',
	'Алгоритмы и структуры данных',
] as const

export function TopicSelect() {
	const [{ topic }, setFilters] = useSkillsFilters()

	return (
		<Select
			aria-label="Тема"
			placeholder="Тема"
			value={topic}
			onChange={(key) => {
				void setFilters({ topic: key as string | null })
			}}
		>
			<Select.Trigger className="base-select">
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>

			<Select.Popover>
				<ListBox>
					{TOPIC_OPTIONS.map((topicOption) => (
						<ListBox.Item key={topicOption} id={topicOption}>
							{topicOption}
						</ListBox.Item>
					))}
				</ListBox>
			</Select.Popover>
		</Select>
	)
}
