import type { GetCores200 } from '@repo/api'

import * as allure from 'allure-js-commons'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { CorePlaceholder } from './core-placeholder'

const unavailableCore: GetCores200[number] = {
	type: 'backend',
	name: 'Backend',
	description: 'Серверная логика, базы данных, API и интеграции',
	icon: 'server',
	isAvailable: false,
}

describe('<CorePlaceholder />', () => {
	it('tells the user the section is not ready yet', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'show unavailable catalog core placeholder' },
			{ name: 'severity', value: 'normal' },
		)

		const view = await render(<CorePlaceholder core={unavailableCore} />)

		await expect.element(view.getByText('Раздел в разработке')).toBeVisible()
		await expect
			.element(view.getByText(unavailableCore.description, { exact: false }))
			.toBeVisible()
	})

	it('renders neither the skill grid nor the filters', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'catalog-landing' },
			{ name: 'story', value: 'hide catalog controls for unavailable core' },
			{ name: 'severity', value: 'normal' },
		)

		const view = await render(<CorePlaceholder core={unavailableCore} />)

		expect(view.getByRole('link').all()).toHaveLength(0)
		expect(view.getByRole('textbox').all()).toHaveLength(0)
	})
})
