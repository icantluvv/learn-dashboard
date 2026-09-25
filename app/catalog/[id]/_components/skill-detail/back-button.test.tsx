import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { nextRouterMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

import { BackButton } from './back-button'

describe('<BackButton />', () => {
	afterEach(() => {
		resetNextNavigationMock()
	})

	it('navigates one step back when pressed', async () => {
		const view = await render(<BackButton />)

		await view.getByRole('button', { name: 'Назад' }).click()

		expect(nextRouterMock.back).toHaveBeenCalledTimes(1)
	})
})
