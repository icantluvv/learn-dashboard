'use client'

import { Slider } from '@heroui/react'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

const MIN_QUESTIONS_COUNT = 0
const MAX_QUESTIONS_COUNT = 25

export function QuestionsCountSlider() {
	const [{ maxQuestionsCount, minQuestionsCount }, setFilters] = useSkillsFilters()

	return (
		<Slider
			aria-label="Количество вопросов"
			value={[
				minQuestionsCount ?? MIN_QUESTIONS_COUNT,
				maxQuestionsCount ?? MAX_QUESTIONS_COUNT,
			]}
			maxValue={MAX_QUESTIONS_COUNT}
			minValue={MIN_QUESTIONS_COUNT}
			onChangeEnd={(value) => {
				const [min, max] = value as number[]
				void setFilters({
					minQuestionsCount: min === MIN_QUESTIONS_COUNT ? null : min,
					maxQuestionsCount: max === MAX_QUESTIONS_COUNT ? null : max,
				})
			}}
		>
			<div className="flex items-center justify-between gap-2">
				<span className="text-sm text-gray-600">Количество вопросов</span>
				<Slider.Output />
			</div>

			<Slider.Track>
				<Slider.Fill />
				<Slider.Thumb index={0} />
				<Slider.Thumb index={1} />
			</Slider.Track>
		</Slider>
	)
}
