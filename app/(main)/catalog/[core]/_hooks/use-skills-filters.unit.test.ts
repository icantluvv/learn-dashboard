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
	it('returns only the core when every filter is unset', () => {
		expect(toSkillsQueryParams(emptyFilters, 'frontend')).toStrictEqual({ core: 'frontend' })
	})

	it('returns only the core when search and topic are empty strings', () => {
		expect(
			toSkillsQueryParams({ ...emptyFilters, search: '', topic: '' }, 'frontend'),
		).toStrictEqual({ core: 'frontend' })
	})

	it('keeps the core of the section it was called for', () => {
		expect(toSkillsQueryParams(emptyFilters, 'backend')).toStrictEqual({ core: 'backend' })
	})

	it('includes only the filters that are set', () => {
		expect(
			toSkillsQueryParams({ ...emptyFilters, search: 'closures' }, 'frontend'),
		).toStrictEqual({
			core: 'frontend',
			search: 'closures',
		})
	})

	it('includes minQuestionsCount and maxQuestionsCount even when zero', () => {
		expect(
			toSkillsQueryParams(
				{ ...emptyFilters, minQuestionsCount: 0, maxQuestionsCount: 0 },
				'frontend',
			),
		).toStrictEqual({
			core: 'frontend',
			minQuestionsCount: 0,
			maxQuestionsCount: 0,
		})
	})

	it('combines every active filter into a single params object', () => {
		expect(
			toSkillsQueryParams(
				{
					search: 'test',
					topic: 'JavaScript',
					difficulty: 'medium',
					minQuestionsCount: 5,
					maxQuestionsCount: 20,
				},
				'frontend',
			),
		).toStrictEqual({
			core: 'frontend',
			search: 'test',
			topic: 'JavaScript',
			difficulty: 'medium',
			minQuestionsCount: 5,
			maxQuestionsCount: 20,
		})
	})
})
