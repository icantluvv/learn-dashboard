import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { Skeleton } from './skeleton'

describe('<Skeleton />', () => {
	it('остаётся декоративным и принимает размеры через className', async () => {
		const view = await render(<Skeleton data-testid="skeleton" className="h-4 w-16" />)

		const skeleton = view.getByTestId('skeleton')

		await expect.element(skeleton).toHaveClass('h-4')
		await expect.element(skeleton).toHaveClass('w-16')
		await expect.element(skeleton).toHaveAttribute('data-slot', 'skeleton')
	})
})
