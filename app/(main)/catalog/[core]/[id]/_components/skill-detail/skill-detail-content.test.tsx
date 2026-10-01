import type { GetSkillById200 } from '@repo/api'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { SkillDetailContent } from './skill-detail-content'

const skill: GetSkillById200 = {
	title: 'Замыкания в JavaScript',
	questions: ['Что такое замыкание?', 'Как замыкания используются для мемоизации?'],
	core: 'frontend',
}

const skillId = 'js-closures'

async function renderContent(skillOverride: GetSkillById200 = skill) {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

	const view = render(
		<QueryClientProvider client={queryClient}>
			<SkillDetailContent skill={skillOverride} skillId={skillId} isAuthenticated={false} />
		</QueryClientProvider>,
	)

	return view
}

describe('<SkillDetailContent />', () => {
	it('renders the skill title', async () => {
		const view = await renderContent()

		await expect.element(view.getByText(skill.title)).toBeVisible()
	})

	it('numbers questions starting from 1 in array order', async () => {
		const view = await renderContent()

		await expect.element(view.getByText('1.')).toBeVisible()
		await expect.element(view.getByText(skill.questions[0]!)).toBeVisible()
		await expect.element(view.getByText('2.')).toBeVisible()
		await expect.element(view.getByText(skill.questions[1]!)).toBeVisible()
	})

	it('renders question numbers in the same text color as the question itself', async () => {
		const view = await renderContent()

		const number = view.getByText('1.').element()
		const question = view.getByText(skill.questions[0]!).element()

		expect(getComputedStyle(number).color).toBe(getComputedStyle(question).color)
	})

	it('separates questions by more than the line height inside one question', async () => {
		const view = await renderContent()

		const list = view.getByRole('list').element()
		const question = view.getByText(skill.questions[0]!).element()

		const rowGap = Number.parseFloat(getComputedStyle(list).rowGap)
		const lineHeight = Number.parseFloat(getComputedStyle(question).lineHeight)

		expect(rowGap).toBeGreaterThan(lineHeight)
	})

	it('renders a copy action for every question', async () => {
		const view = await renderContent()

		expect(view.getByRole('button', { name: 'копировать вопрос' }).elements()).toHaveLength(
			skill.questions.length,
		)
	})

	it('shows the completion button next to the title', async () => {
		const view = await renderContent()

		await expect.element(view.getByRole('link', { name: 'Не изучен' })).toBeVisible()
	})

	it('shows a message instead of the list when there are no questions', async () => {
		const view = await renderContent({ ...skill, questions: [] })

		await expect.element(view.getByText('У этого навыка пока нет вопросов.')).toBeVisible()
		expect(view.getByRole('listitem').elements()).toHaveLength(0)
		expect(view.getByRole('button', { name: 'копировать вопрос' }).elements()).toHaveLength(0)
	})
})
