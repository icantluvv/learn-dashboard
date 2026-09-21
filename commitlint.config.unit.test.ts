import { describe, expect, it } from 'vitest'

import { requiredTrailersRule } from './commitlint.config.mjs'

const VALID_MESSAGES = [
	{
		name: 'с Change',
		message: `fix(catalog): исправить федеральный каталог

Подробности изменения.

Change: community-activity-task`,
	},
]

const INVALID_MESSAGES = [
	{
		name: 'без footer',
		message: 'fix(catalog): исправить федеральный каталог',
	},
	{
		name: 'с пустым Change',
		message: `fix(catalog): исправить федеральный каталог

Change:`,
	},
	{
		name: 'с дублирующимся Change',
		message: `fix(catalog): исправить федеральный каталог

Change: community-activity-task
Change: federal-stage-rating`,
	},
	{
		name: 'с трейлером без отделяющей пустой строки',
		message: `fix(catalog): исправить федеральный каталог
Change: community-activity-task`,
	},
	{
		name: 'с текстом после трейлера',
		message: `fix(catalog): исправить федеральный каталог

Change: community-activity-task

Не footer.`,
	},
]

describe('обязательный трейлер commitlint', () => {
	it.each(VALID_MESSAGES)('принимает сообщение $name', ({ message }) => {
		const [valid] = requiredTrailersRule({ raw: message })

		expect(valid).toBe(true)
	})

	it.each(INVALID_MESSAGES)('отклоняет сообщение $name', ({ message }) => {
		const [valid, error] = requiredTrailersRule({ raw: message })

		expect(valid).toBe(false)
		expect(error).toContain('Change: <название-чейнджа>')
	})
})
