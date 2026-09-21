import { DifficultySelect } from './difficulty-select'
import { QuestionsCountSlider } from './questions-count-slider'
import { ResetFiltersButton } from './reset-filters-button'
import { SkillSearchInput } from './skill-search-input'
import { TopicSelect } from './topic-select'

export function FiltersContent() {
	return (
		<div className="v-stack gap-4">
			<h2 className="text-lg font-bold text-black">Фильтры</h2>

			<SkillSearchInput />
			<TopicSelect />
			<DifficultySelect />
			<QuestionsCountSlider />

			<ResetFiltersButton />
		</div>
	)
}
