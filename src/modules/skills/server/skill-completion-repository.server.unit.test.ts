import { beforeEach, describe, expect, it, vi } from 'vitest'

interface QueryResult {
	rows: unknown[]
}

const query = vi.fn<(text: string, values?: unknown[]) => Promise<QueryResult>>()

vi.mock('#/lib/auth/database.server', () => ({
	getAuthDbPool: () => ({ query }),
}))

const { isSkillCompleted, setSkillCompletion } =
	await import('./skill-completion-repository.server')

function foreignKeyViolation() {
	return Object.assign(new Error('insert or update violates foreign key constraint'), {
		code: '23503',
	})
}

describe('skill completion repository', () => {
	beforeEach(() => {
		query.mockReset()
	})

	describe('isSkillCompleted', () => {
		it('filters the mark by user and skill', async () => {
			query.mockResolvedValue({ rows: [{ completed: true }] })

			await expect(isSkillCompleted('user-1', 'js-closures')).resolves.toBe(true)
			expect(query).toHaveBeenCalledWith(
				expect.stringContaining('from user_completed_skill'),
				['user-1', 'js-closures'],
			)
		})

		it('reports no mark for a skill the user has not completed', async () => {
			query.mockResolvedValue({ rows: [{ completed: false }] })

			await expect(isSkillCompleted('user-2', 'js-closures')).resolves.toBe(false)
		})

		it('reports no mark when the query returns nothing', async () => {
			query.mockResolvedValue({ rows: [] })

			await expect(isSkillCompleted('user-1', 'js-closures')).resolves.toBe(false)
		})
	})

	describe('setSkillCompletion', () => {
		it('inserts the mark and returns the recomputed counter', async () => {
			query.mockResolvedValue({ rows: [{ completedSkillsCount: 4 }] })

			const result = await setSkillCompletion('user-1', 'js-closures', true)

			expect(result).toStrictEqual({ completedSkillsCount: 4 })

			const [text, values] = query.mock.calls[0]!
			expect(text).toContain('insert into user_completed_skill')
			expect(text).toContain('on conflict do nothing')
			// Счётчик берётся из таблицы отметок, а не сдвигается от прежнего значения.
			expect(text).toContain('select count(*) from user_completed_skill')
			// И корректируется на строки, вставленные CTE: в одном снапшоте `count(*)` ещё не
			// видит только что вставленную строку.
			expect(text).toContain('+ (select count(*) from changed)')
			expect(text).toContain('returning 1')
			expect(values).toStrictEqual(['user-1', 'js-closures'])
		})

		it('deletes the mark and returns the recomputed counter', async () => {
			query.mockResolvedValue({ rows: [{ completedSkillsCount: 2 }] })

			const result = await setSkillCompletion('user-1', 'js-closures', false)

			expect(result).toStrictEqual({ completedSkillsCount: 2 })

			const [text] = query.mock.calls[0]!
			expect(text).toContain('delete from user_completed_skill')
			expect(text).toContain('select count(*) from user_completed_skill')
			// Удалённая строка в том же снапшоте ещё видна, поэтому поправка вычитается.
			expect(text).toContain('- (select count(*) from changed)')
		})

		it('changes the mark and the counter in a single statement', async () => {
			query.mockResolvedValue({ rows: [{ completedSkillsCount: 1 }] })

			await setSkillCompletion('user-1', 'js-closures', true)

			expect(query).toHaveBeenCalledTimes(1)
		})

		it('reports the skill as missing when the foreign key is violated', async () => {
			query.mockRejectedValue(foreignKeyViolation())

			await expect(setSkillCompletion('user-1', 'missing', true)).resolves.toBeNull()
		})

		it('reports missing when the user row is gone', async () => {
			query.mockResolvedValue({ rows: [] })

			await expect(
				setSkillCompletion('deleted-user', 'js-closures', true),
			).resolves.toBeNull()
		})

		it('propagates storage errors instead of reporting a missing skill', async () => {
			query.mockRejectedValue(new Error('connection terminated'))

			await expect(setSkillCompletion('user-1', 'js-closures', true)).rejects.toThrow(
				'connection terminated',
			)
		})
	})
})
