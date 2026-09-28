import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { BRAND_NAME } from '#/seo'

import { Logo } from './logo'

describe('<Logo />', () => {
	it('ведёт на главную и имеет доступное имя', async () => {
		const view = await render(<Logo />)

		const link = view.getByRole('link', { name: `${BRAND_NAME} — на главную` })

		await expect.element(link).toHaveAttribute('href', '/')
	})
})
