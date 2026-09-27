import type { GetSkills200 } from '@repo/api'

import type { DIFFICULTY_OPTIONS } from '#/constants/difficulty-options'

type Difficulty = (typeof DIFFICULTY_OPTIONS)[number]['id']

export interface CatalogStats {
	byDifficulty: Record<Difficulty, number>
	questionsCount: number
	skillsCount: number
	topicsCount: number
}

export function computeCatalogStats(skills: GetSkills200): CatalogStats {
	const byDifficulty: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 }
	const topics = new Set<string>()
	let questionsCount = 0

	for (const skill of skills) {
		topics.add(skill.topic)
		questionsCount += skill.questionsCount
		byDifficulty[skill.difficulty] += 1
	}

	return {
		byDifficulty,
		questionsCount,
		skillsCount: skills.length,
		topicsCount: topics.size,
	}
}
