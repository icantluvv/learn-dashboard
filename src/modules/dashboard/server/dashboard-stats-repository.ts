import type { GetDashboardStats200 } from '@repo/api'

import { getDashboardStats200Schema } from '@repo/api/base/codegen/zod/dashboardController/getDashboardStatsSchema'

import { getCurrentUser } from '#/lib/auth/get-session'
import { computeCatalogStats } from '#/modules/skills/compute-catalog-stats'
import { getSkills } from '#/modules/skills/server/skills-repository'

import 'server-only'

export async function getDashboardStats(): Promise<GetDashboardStats200> {
	const [skills, user] = await Promise.all([getSkills(), getCurrentUser()])
	const { questionsCount, skillsCount, topicsCount } = computeCatalogStats(skills)

	return getDashboardStats200Schema.parse({
		skillsCount,
		topicsCount,
		questionsCount,
		...(user == null ? {} : { completedSkillsCount: user.completedSkillsCount ?? 0 }),
	})
}
