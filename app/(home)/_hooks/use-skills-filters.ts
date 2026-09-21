'use client'

import type { GetSkillsQueryParams } from '@repo/api'

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

const DIFFICULTY_VALUES = ['easy', 'medium', 'hard'] as const

const skillsFiltersParsers = {
	search: parseAsString,
	topic: parseAsString,
	difficulty: parseAsStringLiteral(DIFFICULTY_VALUES),
	minQuestionsCount: parseAsInteger,
	maxQuestionsCount: parseAsInteger,
}

export type SkillsFiltersState = {
	[K in keyof typeof skillsFiltersParsers]: ReturnType<
		(typeof skillsFiltersParsers)[K]['parse']
	> | null
}

export function useSkillsFilters() {
	return useQueryStates(skillsFiltersParsers)
}

export function toSkillsQueryParams(filters: SkillsFiltersState): GetSkillsQueryParams | undefined {
	const params: GetSkillsQueryParams = {}

	if (filters.search != null && filters.search !== '') {
		params.search = filters.search
	}

	if (filters.topic != null && filters.topic !== '') {
		params.topic = filters.topic
	}

	if (filters.difficulty != null) {
		params.difficulty = filters.difficulty
	}

	if (filters.minQuestionsCount != null) {
		params.minQuestionsCount = filters.minQuestionsCount
	}

	if (filters.maxQuestionsCount != null) {
		params.maxQuestionsCount = filters.maxQuestionsCount
	}

	return Object.keys(params).length > 0 ? params : undefined
}
