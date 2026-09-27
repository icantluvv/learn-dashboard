import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { SkillDetailError } from './skill-detail-error'

describe('<SkillDetailError />', () => {
	it('renders the error message', async () => {
		const view = await render(<SkillDetailError />)

		await expect
			.element(view.getByText('Не удалось загрузить навык. Попробуйте обновить страницу.'))
			.toBeVisible()
	})
})
