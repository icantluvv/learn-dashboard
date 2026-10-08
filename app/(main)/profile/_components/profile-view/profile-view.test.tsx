import type { CurrentUser } from '#/lib/auth/get-session'
import type { RemoveAvatarActionResult, UpdateAvatarActionResult } from '#/modules/auth/types'
import type { CompletedSkillsCoreGroup } from '#/modules/skills/server/skill-completion-repository.server'

import * as allure from 'allure-js-commons'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { nextRouterMock } from '#/tests/mocks/next-navigation'
import { renderWithProviders } from '#/tests/render'

const { useGetAuthMe, useGetCompletedSkillsByCore } = vi.hoisted(() => ({
	useGetAuthMe: vi.fn(),
	useGetCompletedSkillsByCore: vi.fn(),
}))

vi.mock('@repo/api', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@repo/api')>()
	return { ...actual, useGetAuthMe, useGetCompletedSkillsByCore }
})

const { ProfileView } = await import('./profile-view')

const removeAvatarAction = vi.fn<() => Promise<RemoveAvatarActionResult>>()
const updateAvatarAction = vi.fn<(formData: FormData) => Promise<UpdateAvatarActionResult>>()

const user: CurrentUser = {
	id: 'user-1',
	name: 'Сергей',
	email: 'user@example.com',
	gender: 'male',
	age: 28,
	role: 'developer',
}

const noSkillGroups: CompletedSkillsCoreGroup[] = []

describe('<ProfileView />', () => {
	beforeEach(() => {
		useGetCompletedSkillsByCore.mockReturnValue({
			data: noSkillGroups,
			isError: false,
			isFetching: false,
			isLoading: false,
			refetch: vi.fn(),
		})
	})

	it('показывает экран загрузки, пока запрос выполняется', async () => {
		useGetAuthMe.mockReturnValue({
			data: undefined,
			error: null,
			isError: false,
			isLoading: true,
		})

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('Сергей')).not.toBeInTheDocument()
		await expect
			.element(view.getByText('Войдите в профиль, чтобы увидеть свои данные'))
			.not.toBeInTheDocument()
	})

	it.each([401, 403, 500])('показывает ошибку без редиректа при ответе %s', async (status) => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'Авторизация' },
			{ name: 'story', value: 'Отображение ошибки загрузки профиля без редиректа' },
			{ name: 'severity', value: 'critical' },
		)
		useGetAuthMe.mockReturnValue({
			data: undefined,
			error: new Error('Request failed', { cause: { status } }),
			isError: true,
			isLoading: false,
		})
		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)
		await expect
			.element(view.getByText('Не удалось загрузить профиль. Попробуйте обновить страницу.'))
			.toBeVisible()
		expect(nextRouterMock.replace).not.toHaveBeenCalled()
		await expect.element(view.getByText('Сергей')).not.toBeInTheDocument()
	})

	it('показывает данные профиля для авторизованного пользователя', async () => {
		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByText('user@example.com')).toBeVisible()
		await expect.element(view.getByText('Разработчик')).toBeVisible()
		await expect.element(view.getByRole('button', { name: 'Выйти' })).toBeVisible()
	})

	it('показывает фамилию рядом с именем, если она задана', async () => {
		useGetAuthMe.mockReturnValue({
			data: { ...user, lastName: 'Пантелеев' },
			error: null,
			isError: false,
			isLoading: false,
		})

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('Сергей Пантелеев')).toBeVisible()
	})

	it('показывает только имя, если фамилия не задана', async () => {
		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('Сергей')).toBeVisible()
		await expect.element(view.getByText('Сергей Пантелеев')).not.toBeInTheDocument()
	})

	it.each([
		['developer', 'Разработчик'],
		['analyst', 'Аналитик'],
		['student', 'Студент'],
		['beginner', 'Начинающий'],
	] as const)('отображает роль %s как «%s»', async (role, label) => {
		useGetAuthMe.mockReturnValue({
			data: { ...user, role },
			error: null,
			isError: false,
			isLoading: false,
		})

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText(label)).toBeVisible()
	})

	it('показывает возраст, если он задан', async () => {
		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('28 лет')).toBeVisible()
	})

	it('не показывает строку с возрастом, если он не задан', async () => {
		const { age, ...userWithoutAge } = user
		void age
		useGetAuthMe.mockReturnValue({
			data: userWithoutAge,
			error: null,
			isError: false,
			isLoading: false,
		})

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('лет', { exact: false })).not.toBeInTheDocument()
	})

	it('показывает сообщение об отсутствии изученных навыков, если групп нет', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'profile' },
			{
				name: 'story',
				value: 'показывает сообщение об отсутствии изученных навыков, если групп нет',
			},
			{ name: 'severity', value: 'normal' },
		)

		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect
			.element(view.getByText('Вы ещё не отметили ни одного навыка изученным'))
			.toBeVisible()
	})

	it('показывает изученные навыки, сгруппированные по направлениям', async () => {
		await allure.labels(
			{ name: 'layer', value: 'component' },
			{ name: 'feature', value: 'profile' },
			{
				name: 'story',
				value: 'показывает изученные навыки, сгруппированные по направлениям',
			},
			{ name: 'severity', value: 'normal' },
		)

		useGetAuthMe.mockReturnValue({ data: user, error: null, isError: false, isLoading: false })
		const groups: CompletedSkillsCoreGroup[] = [
			{
				core: 'frontend',
				coreName: 'Frontend',
				skills: [{ id: 'js-closures', title: 'Замыкания' }],
			},
			{
				core: 'backend',
				coreName: 'Backend',
				skills: [{ id: 'db-indexes', title: 'Индексы БД' }],
			},
		]

		useGetCompletedSkillsByCore.mockReturnValue({
			data: groups,
			isError: false,
			isFetching: false,
			isLoading: false,
			refetch: vi.fn(),
		})

		const view = await renderWithProviders(
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>,
		)

		await expect.element(view.getByText('Frontend')).toBeVisible()
		await expect.element(view.getByText('Замыкания')).toBeVisible()
		await expect.element(view.getByText('Backend')).toBeVisible()
		await expect.element(view.getByText('Индексы БД')).toBeVisible()
		await expect
			.element(view.getByText('Вы ещё не отметили ни одного навыка изученным'))
			.not.toBeInTheDocument()
	})
})
