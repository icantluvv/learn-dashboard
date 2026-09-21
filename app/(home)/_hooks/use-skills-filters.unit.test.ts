import { describe, expect, it } from 'vitest'

import { toSkillsQueryParams } from './use-skills-filters'

const emptyFilters = {
	search: null,
	topic: null,
	difficulty: null,
	minQuestionsCount: null,
	maxQuestionsCount: null,
} as const

describe('toSkillsQueryParams', () => {
	it('returns undefined when every filter is unset', () => {
		expect(toSkillsQueryParams(emptyFilters)).toBeUndefined()
	})

	it('returns undefined when search and topic are empty strings', () => {
		expect(toSkillsQueryParams({ ...emptyFilters, search: '', topic: '' })).toBeUndefined()
	})

	it('includes only the filters that are set', () => {
		expect(toSkillsQueryParams({ ...emptyFilters, search: 'closures' })).toStrictEqual({
			search: 'closures',
		})
	})

	it('includes minQuestionsCount and maxQuestionsCount even when zero', () => {
		expect(
			toSkillsQueryParams({ ...emptyFilters, minQuestionsCount: 0, maxQuestionsCount: 0 }),
		).toStrictEqual({
			minQuestionsCount: 0,
			maxQuestionsCount: 0,
		})
	})

	it('combines every active filter into a single params object', () => {
		expect(
			toSkillsQueryParams({
				search: 'test',
				topic: 'JavaScript',
				difficulty: 'medium',
				minQuestionsCount: 5,
				maxQuestionsCount: 20,
			}),
		).toStrictEqual({
			search: 'test',
			topic: 'JavaScript',
			difficulty: 'medium',
			minQuestionsCount: 5,
			maxQuestionsCount: 20,
		})
	})
})
