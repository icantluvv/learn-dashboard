'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/core'

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
			value={topic}
			onValueChange={(value: string | null) => {
				void setFilters({ topic: value })
			}}
		>
			<SelectTrigger aria-label="Тема" className="w-full">
				<SelectValue>{(value: string | null) => value ?? 'Тема'}</SelectValue>
			</SelectTrigger>

			<SelectContent>
				{TOPIC_OPTIONS.map((topicOption) => (
					<SelectItem key={topicOption} value={topicOption}>
						{topicOption}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
