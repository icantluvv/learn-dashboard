import type { QueryClient } from '@tanstack/react-query'

import { getSkillByIdQueryKey } from '@repo/api'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSkillById = vi.fn()
const getCurrentUser = vi.fn()
const isSkillCompleted = vi.fn<(userId: string, skillId: string) => Promise<boolean>>()

vi.mock('#/modules/skills/server/skills-repository', () => ({ getSkillById }))
vi.mock('#/lib/auth/get-session', () => ({ getCurrentUser }))
vi.mock('#/modules/skills/server/skill-completion-repository.server', () => ({
	isSkillCompleted: async (userId: string, skillId: string) => isSkillCompleted(userId, skillId),
}))

let queryClient: QueryClient

vi.mock('#/utils/get-query-client', () => ({ getQueryClient: () => queryClient }))

const { default: CatalogSkillPage } = await import('./page')
const { QueryClient: RealQueryClient } = await import('@tanstack/react-query')

const skill = { title: 'Замыкания', questions: ['Q1'], core: 'frontend' }
const skillId = 'js-closures'

function warmedSkill() {
	return queryClient.getQueryData(getSkillByIdQueryKey({ id: skillId }))
}

describe('прогрев клиентского кэша страницей навыка', () => {
	beforeEach(() => {
		queryClient = new RealQueryClient({ defaultOptions: { queries: { retry: false } } })
		getSkillById.mockReset()
		getCurrentUser.mockReset()
		isSkillCompleted.mockReset()
		getSkillById.mockResolvedValue(skill)
		getCurrentUser.mockResolvedValue(null)
		isSkillCompleted.mockResolvedValue(false)
	})

	it('прогревает кэш отметкой авторизованного пользователя', async () => {
		getCurrentUser.mockResolvedValue({ id: 'user-1' })
		isSkillCompleted.mockResolvedValue(true)

		await CatalogSkillPage({ params: Promise.resolve({ core: 'frontend', id: skillId }) })

		expect(warmedSkill()).toStrictEqual({ ...skill, completed: true })
		expect(isSkillCompleted).toHaveBeenCalledWith('user-1', skillId)
	})

	it('прогревает кэш без отметки для анонимного пользователя', async () => {
		await CatalogSkillPage({ params: Promise.resolve({ core: 'frontend', id: skillId }) })

		expect(warmedSkill()).toStrictEqual(skill)
		expect(isSkillCompleted).not.toHaveBeenCalled()
	})
})
