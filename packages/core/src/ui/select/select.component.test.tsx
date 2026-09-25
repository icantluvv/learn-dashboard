import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const OPTIONS = ['JavaScript', 'TypeScript'] as const

function TestSelect({ onValueChange }: { onValueChange: (value: string | null) => void }) {
	return (
		<Select onValueChange={onValueChange}>
			<SelectTrigger aria-label="Тема">
				<SelectValue>{(value: string | null) => value ?? 'Тема'}</SelectValue>
			</SelectTrigger>

			<SelectContent>
				{OPTIONS.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

describe('<Select />', () => {
	it('показывает placeholder, пока значение не выбрано', async () => {
		const view = await render(<TestSelect onValueChange={vi.fn()} />)

		await expect.element(view.getByRole('combobox', { name: 'Тема' })).toHaveTextContent('Тема')
	})

	it('сообщает выбранное значение и отражает его в триггере', async () => {
		const onValueChange = vi.fn()

		const view = await render(<TestSelect onValueChange={onValueChange} />)

		await view.getByRole('combobox', { name: 'Тема' }).click()
		await view.getByRole('option', { name: 'TypeScript' }).click()

		expect(onValueChange).toHaveBeenCalledWith('TypeScript', expect.anything())
		await expect
			.element(view.getByRole('combobox', { name: 'Тема' }))
			.toHaveTextContent('TypeScript')
	})
})
