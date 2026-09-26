'use client'

import { Slider } from '@repo/core'

import { useSkillsFilters } from '../../_hooks/use-skills-filters'

const MIN_QUESTIONS_COUNT = 0
const MAX_QUESTIONS_COUNT = 25

export function QuestionsCountSlider() {
	const [{ maxQuestionsCount, minQuestionsCount }, setFilters] = useSkillsFilters()

	const min = minQuestionsCount ?? MIN_QUESTIONS_COUNT
	const max = maxQuestionsCount ?? MAX_QUESTIONS_COUNT

	return (
		<div className="v-stack gap-4">
			<div className="flex items-center justify-between gap-2">
				<span className="text-sm text-heading">Количество вопросов</span>
				<span className="text-sm text-heading">
					{min} – {max}
				</span>
			</div>

			<Slider
				aria-label="Количество вопросов"
				value={[min, max]}
				min={MIN_QUESTIONS_COUNT}
				max={MAX_QUESTIONS_COUNT}
				onValueCommitted={(value: number | readonly number[]) => {
					const committed: readonly number[] =
						typeof value === 'number' ? [value, value] : value
					const nextMin = committed[0] ?? MIN_QUESTIONS_COUNT
					const nextMax = committed[1] ?? MAX_QUESTIONS_COUNT

					void setFilters({
						minQuestionsCount: nextMin === MIN_QUESTIONS_COUNT ? null : nextMin,
						maxQuestionsCount: nextMax === MAX_QUESTIONS_COUNT ? null : nextMax,
					})
				}}
			/>
		</div>
	)
}
