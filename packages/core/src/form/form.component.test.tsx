import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import * as z from 'zod/mini'

import { Button } from '../ui/button'
import { useAppForm } from './index'

const schema = z.object({
	name: z.string().check(z.minLength(3, { error: 'Имя должно содержать минимум 3 символа' })),
	age: z
		.nullable(z.number())
		.check(z.refine((value) => value != null, { error: 'Укажите возраст' })),
	gender: z
		.nullable(z.enum(['male', 'female']))
		.check(z.refine((value) => value != null, { error: 'Выберите пол' })),
})

function TestForm({ onSubmit }: { onSubmit: (values: unknown) => Promise<void> | void }) {
	const form = useAppForm({
		defaultValues: {
			name: '',
			age: null as number | null,
			gender: null as 'female' | 'male' | null,
		},
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			await onSubmit(value)
		},
	})

	return (
		<form
			noValidate
			onSubmit={(event) => {
				event.preventDefault()
				void form.handleSubmit()
			}}
		>
			<form.AppField name="name">{(field) => <field.TextField label="Имя" />}</form.AppField>
			<form.AppField name="age">
				{(field) => <field.NumberField label="Возраст" />}
			</form.AppField>
			<form.AppField name="gender">
				{(field) => (
					<field.SelectField
						label="Пол"
						placeholder="Выберите пол"
						options={[
							{ value: 'male', label: 'Мужской' },
							{ value: 'female', label: 'Женский' },
						]}
					/>
				)}
			</form.AppField>
			<form.Subscribe selector={(state) => state.isSubmitting}>
				{(isSubmitting) => (
					<Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
						{isSubmitting ? 'Отправляем...' : 'Отправить'}
					</Button>
				)}
			</form.Subscribe>
		</form>
	)
}

describe('@repo/core/form', () => {
	it('показывает ошибку валидации и не отправляет форму', async () => {
		const onSubmit = vi.fn()
		const view = await render(<TestForm onSubmit={onSubmit} />)

		await view.getByRole('textbox', { name: 'Имя' }).fill('Ан')
		await view.getByRole('button', { name: 'Отправить' }).click()

		await expect.element(view.getByText('Имя должно содержать минимум 3 символа')).toBeVisible()
		await expect.element(view.getByText('Укажите возраст')).toBeVisible()
		await expect.element(view.getByRole('alert').nth(2)).toHaveTextContent('Выберите пол')
		expect(onSubmit).not.toHaveBeenCalled()
	})

	it('помечает невалидное поле для assistive technologies', async () => {
		const view = await render(<TestForm onSubmit={vi.fn()} />)

		await view.getByRole('textbox', { name: 'Имя' }).fill('Ан')
		await view.getByRole('button', { name: 'Отправить' }).click()

		await expect
			.element(view.getByRole('textbox', { name: 'Имя' }))
			.toHaveAttribute('aria-invalid', 'true')
		await expect
			.element(view.getByRole('textbox', { name: 'Имя' }))
			.toHaveAttribute('aria-describedby', 'field-name-error')
	})

	it('отправляет валидные значения', async () => {
		const onSubmit = vi.fn()
		const view = await render(<TestForm onSubmit={onSubmit} />)

		await view.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
		await view.getByRole('spinbutton', { name: 'Возраст' }).fill('28')
		await view.getByRole('combobox', { name: 'Пол' }).click()
		await view.getByRole('option', { name: 'Мужской' }).click()
		await view.getByRole('button', { name: 'Отправить' }).click()

		await vi.waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith({ name: 'Сергей', age: 28, gender: 'male' })
		})
	})

	it('блокирует кнопку на время отправки, поэтому второй клик не отправляет форму повторно', async () => {
		let resolveSubmit: (() => void) | undefined
		const onSubmit = vi.fn(
			async () =>
				new Promise<void>((resolve) => {
					resolveSubmit = resolve
				}),
		)
		const view = await render(<TestForm onSubmit={onSubmit} />)

		await view.getByRole('textbox', { name: 'Имя' }).fill('Сергей')
		await view.getByRole('spinbutton', { name: 'Возраст' }).fill('28')
		await view.getByRole('combobox', { name: 'Пол' }).click()
		await view.getByRole('option', { name: 'Мужской' }).click()

		const submit = view.getByRole('button', { name: 'Отправить' })
		await submit.click()

		await expect.element(view.getByRole('button', { name: 'Отправляем...' })).toBeDisabled()

		resolveSubmit?.()

		await vi.waitFor(() => {
			expect(onSubmit).toHaveBeenCalledTimes(1)
		})
	})
})
