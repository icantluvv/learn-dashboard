import type { GetSkillById200 } from '@repo/api'

import { getSkillByIdQueryKey } from '@repo/api'
import { Toaster } from '@repo/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { nextNavigationMock, resetNextNavigationMock } from '#/tests/mocks/next-navigation'

import { SkillCompletionButton } from './skill-completion-button'

const setSkillCompletion =
	vi.fn<
		(config: unknown) => Promise<{ data: { completed: boolean; completedSkillsCount: number } }>
	>()

vi.mock('@repo/api/base/codegen/clients/skillsController/setSkillCompletion', () => ({
	setSkillCompletion: async (
		parameters: { data: { completed: boolean }; id: string },
		config: unknown,
	) => {
		const result = await setSkillCompletion({ parameters, config })
		return result.data
	},
}))

const skillId = 'js-closures'

const skill: GetSkillById200 = {
	title: 'Замыкания',
	questions: ['Q1'],
	core: 'frontend',
}

async function renderButton({ completed }: { completed?: boolean } = {}) {
	const queryClient = new QueryClient({
		defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
	})

	queryClient.setQueryData(getSkillByIdQueryKey({ id: skillId }), {
		...skill,
		...(completed == null ? {} : { completed }),
	})

	const view = await render(
		<QueryClientProvider client={queryClient}>
			<Toaster>
				<SkillCompletionButton skillId={skillId} isAuthenticated />
			</Toaster>
		</QueryClientProvider>,
	)

	return { queryClient, view }
}

describe('<SkillCompletionButton />', () => {
	beforeEach(() => {
		setSkillCompletion.mockReset()
		resetNextNavigationMock()
		setSkillCompletion.mockResolvedValue({
			data: { completed: true, completedSkillsCount: 1 },
		})
	})

	it('показывает состояние «не отмечено» из прогретого кэша', async () => {
		const { view } = await renderButton({ completed: false })

		await expect
			.element(view.getByRole('button', { name: 'Изучен' }))
			.toHaveAttribute('aria-pressed', 'false')
	})

	it('показывает состояние «отмечено» из прогретого кэша с первого рендера', async () => {
		const { view } = await renderButton({ completed: true })

		await expect
			.element(view.getByRole('button', { name: 'Изучен' }))
			.toHaveAttribute('aria-pressed', 'true')
	})

	it('отмечает навык изученным', async () => {
		const { view } = await renderButton({ completed: false })

		await view.getByRole('button', { name: 'Изучен' }).click()

		await vi.waitFor(() => {
			expect(setSkillCompletion).toHaveBeenCalledWith(
				expect.objectContaining({
					parameters: { id: skillId, data: { completed: true } },
				}),
			)
		})
		await expect
			.element(view.getByRole('button', { name: 'Изучен' }))
			.toHaveAttribute('aria-pressed', 'true')
	})

	it('снимает случайно поставленную отметку', async () => {
		setSkillCompletion.mockResolvedValue({
			data: { completed: false, completedSkillsCount: 0 },
		})
		const { view } = await renderButton({ completed: true })

		await view.getByRole('button', { name: 'Изучен' }).click()

		await vi.waitFor(() => {
			expect(setSkillCompletion).toHaveBeenCalledWith(
				expect.objectContaining({
					parameters: { id: skillId, data: { completed: false } },
				}),
			)
		})
		await expect
			.element(view.getByRole('button', { name: 'Изучен' }))
			.toHaveAttribute('aria-pressed', 'false')
	})

	it('блокирует кнопку на время запроса и не отправляет второй запрос', async () => {
		let resolveRequest:
			| ((result: { data: { completed: boolean; completedSkillsCount: number } }) => void)
			| undefined
		setSkillCompletion.mockImplementation(
			async () =>
				new Promise((resolve) => {
					resolveRequest = resolve
				}),
		)
		const { view } = await renderButton({ completed: false })
		const button = view.getByRole('button', { name: 'Изучен' })

		await button.click()
		await expect.element(button).toBeDisabled()

		resolveRequest?.({ data: { completed: true, completedSkillsCount: 1 } })

		await vi.waitFor(() => {
			expect(setSkillCompletion).toHaveBeenCalledTimes(1)
		})
	})

	it('возвращает состояние и сообщает об ошибке, если запрос не удался', async () => {
		setSkillCompletion.mockRejectedValue(new Error('network'))
		const { view } = await renderButton({ completed: false })

		await view.getByRole('button', { name: 'Изучен' }).click()

		await expect.element(view.getByText('Не удалось сохранить отметку')).toBeVisible()
		await expect
			.element(view.getByRole('button', { name: 'Изучен' }))
			.toHaveAttribute('aria-pressed', 'false')
	})

	it('для гостя показывает ссылку на вход с адресом возврата и не отправляет запрос', async () => {
		nextNavigationMock.pathname = '/catalog/frontend/js-closures'
		const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

		const view = await render(
			<QueryClientProvider client={queryClient}>
				<SkillCompletionButton isAuthenticated={false} skillId={skillId} />
			</QueryClientProvider>,
		)

		// Клик здесь не воспроизводится: настоящая навигация уводит тестовый iframe со страницы.
		// Переход проверяется E2E-сценарием, а тут важно, что это ссылка на вход, а не кнопка
		// мутации: у элемента роль `link` и адрес возврата, обработчика отметки нет.
		const link = view.getByRole('link', { name: 'Изучен' })

		await expect
			.element(link)
			.toHaveAttribute('href', '/sign-in?next=%2Fcatalog%2Ffrontend%2Fjs-closures')
		expect(view.getByRole('button', { name: 'Изучен' }).elements()).toHaveLength(0)
		expect(setSkillCompletion).not.toHaveBeenCalled()
	})
})
