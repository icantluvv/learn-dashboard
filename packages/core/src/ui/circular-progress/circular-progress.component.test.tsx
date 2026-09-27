import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'

import { CircularProgress } from './circular-progress'

describe('<CircularProgress />', () => {
	it('сообщает текущее значение вспомогательным технологиям', async () => {
		const view = await render(<CircularProgress aria-label="Прогресс" value={40} />)

		await expect.element(view.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
	})

	it('рендерит индикатор как индетерминированный при value=null', async () => {
		const view = await render(<CircularProgress aria-label="Прогресс" value={null} />)

		await expect.element(view.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
	})
})
