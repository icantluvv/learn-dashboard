import type { GetSkillById200 } from '@repo/api'

import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { SkillDetailContent } from './skill-detail-content'

const skill: GetSkillById200 = {
	title: 'Замыкания в JavaScript',
	questions: ['Что такое замыкание?', 'Как замыкания используются для мемоизации?'],
}

describe('<SkillDetailContent />', () => {
	it('renders the skill title', async () => {
		const view = await render(<SkillDetailContent skill={skill} />)

		await expect.element(view.getByText(skill.title)).toBeVisible()
	})

	it('numbers questions starting from 1 in array order', async () => {
		const view = await render(<SkillDetailContent skill={skill} />)

		await expect.element(view.getByText('1.')).toBeVisible()
		await expect.element(view.getByText(skill.questions[0]!)).toBeVisible()
		await expect.element(view.getByText('2.')).toBeVisible()
		await expect.element(view.getByText(skill.questions[1]!)).toBeVisible()
	})

	it('shows a message instead of the list when there are no questions', async () => {
		const view = await render(<SkillDetailContent skill={{ ...skill, questions: [] }} />)

		await expect.element(view.getByText('У этого навыка пока нет вопросов.')).toBeVisible()
		expect(view.getByRole('listitem').elements()).toHaveLength(0)
	})
})
