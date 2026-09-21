import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { ResetFiltersButton } from './reset-filters-button'

describe('<ResetFiltersButton />', () => {
	it('clears every filter from the URL when pressed', async () => {
		const onUrlUpdate = vi.fn()

		const view = await render(<ResetFiltersButton />, {
			wrapper: ({ children }) => (
				<NuqsTestingAdapter
					searchParams="?search=closures&topic=JavaScript&difficulty=medium"
					onUrlUpdate={onUrlUpdate}
				>
					{children}
				</NuqsTestingAdapter>
			),
		})

		await view.getByRole('button', { name: 'Сбросить фильтры' }).click()

		expect(onUrlUpdate).toHaveBeenCalled()
		const lastCall = onUrlUpdate.mock.calls.at(-1) as [{ searchParams: URLSearchParams }]
		expect(lastCall[0].searchParams.toString()).toBe('')
	})
})
