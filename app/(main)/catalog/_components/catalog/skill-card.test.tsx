import type { GetSkills200 } from '@repo/api'

import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { SkillCard } from './skill-card'

const skill: GetSkills200[number] = {
	id: 'js-closures',
	title: 'Замыкания в JavaScript',
	topic: 'JavaScript',
	difficulty: 'medium',
	questionsCount: 12,
}

describe('<SkillCard />', () => {
	it('renders the skill title, topic and questions count', async () => {
		const view = await render(<SkillCard skill={skill} />)

		await expect.element(view.getByText(skill.title)).toBeVisible()
		await expect.element(view.getByText(skill.topic, { exact: true })).toBeVisible()
		await expect.element(view.getByText('12 вопросов')).toBeVisible()
	})

	it('renders the difficulty label in Russian', async () => {
		const view = await render(<SkillCard skill={skill} />)

		await expect.element(view.getByText('Средний')).toBeVisible()
	})

	it('links to the skill detail page', async () => {
		const view = await render(<SkillCard skill={skill} />)

		await expect.element(view.getByRole('link')).toHaveAttribute('href', '/catalog/js-closures')
	})
})
