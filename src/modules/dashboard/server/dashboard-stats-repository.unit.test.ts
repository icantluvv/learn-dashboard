import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkills = vi.fn()
const getCurrentUser = vi.fn()

vi.mock('#/modules/skills/server/skills-repository', () => ({ getSkills }))
vi.mock('#/lib/auth/get-session', () => ({ getCurrentUser }))

const { getDashboardStats } = await import('./dashboard-stats-repository')

const skills = [
	{ id: 's1', title: 'A', questionsCount: 2, difficulty: 'easy', topic: 'JS', core: 'frontend' },
	{ id: 's2', title: 'B', questionsCount: 3, difficulty: 'hard', topic: 'CSS', core: 'frontend' },
]

describe('сводная статистика дашборда', () => {
	beforeEach(() => {
		getSkills.mockReset()
		getCurrentUser.mockReset()
		getSkills.mockResolvedValue(skills)
		getCurrentUser.mockResolvedValue(null)
	})

	it('отдаёт число изученных навыков, равное счётчику пользователя', async () => {
		getCurrentUser.mockResolvedValue({ id: 'user-1', completedSkillsCount: 2 })

		const stats = await getDashboardStats()

		expect(stats.completedSkillsCount).toBe(2)
	})

	it('отражает снятие отметки уменьшенным числом', async () => {
		getCurrentUser.mockResolvedValue({ id: 'user-1', completedSkillsCount: 1 })

		const stats = await getDashboardStats()

		expect(stats.completedSkillsCount).toBe(1)
	})

	it('отдаёт ноль, когда у пользователя нет отметок', async () => {
		getCurrentUser.mockResolvedValue({ id: 'user-1', completedSkillsCount: 0 })

		const stats = await getDashboardStats()

		expect(stats.completedSkillsCount).toBe(0)
	})

	it('не отдаёт число изученных навыков анонимному пользователю', async () => {
		const stats = await getDashboardStats()

		expect(stats).not.toHaveProperty('completedSkillsCount')
		expect(stats.skillsCount).toBe(2)
	})
})
