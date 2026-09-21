import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import packageJson from './package.json'

interface CommitAnswers {
	body: string
	breaking?: string
	breakingBody?: string
	change: string
	isBreaking: boolean
	scope: string
	subject: string
	type: string
}

interface PromptQuestion {
	choices?: { name: string; value: string }[]
	name: keyof CommitAnswers
	type: 'confirm' | 'input' | 'list'
	filter?: (value: string) => string
	validate?: (value: string) => boolean | string
}

interface CommitizenClient {
	prompt: (questions: PromptQuestion[]) => Promise<CommitAnswers>
}

type Commit = (errorOrMessage: Error | string, template?: string, overrideOptions?: unknown) => void
type Prompter = (cz: CommitizenClient, commit: Commit) => Promise<void>

interface CommitizenAdapter {
	prompter: Prompter
	buildCommitMessage: (answers: CommitAnswers) => string
	createPrompter: (changesDirectory?: string) => Prompter
	getOpenSpecChanges: (changesDirectory?: string) => string[]
}

const require = createRequire(import.meta.url)
const { buildCommitMessage, createPrompter, getOpenSpecChanges, prompter } =
	require('./commitizen-adapter.cjs') as CommitizenAdapter

let temporaryDirectory: string | undefined

afterEach(() => {
	if (temporaryDirectory !== undefined) {
		rmSync(temporaryDirectory, { force: true, recursive: true })
	}

	temporaryDirectory = undefined
})

function createChangesDirectory() {
	temporaryDirectory = mkdtempSync(path.join(tmpdir(), 'oxlint-commitizen-'))
	mkdirSync(path.join(temporaryDirectory, 'zeta-change'))
	mkdirSync(path.join(temporaryDirectory, 'archive'))
	mkdirSync(path.join(temporaryDirectory, 'alpha-change'))
	writeFileSync(path.join(temporaryDirectory, 'README.md'), 'not a change')

	return temporaryDirectory
}

function findPromptQuestion(questions: PromptQuestion[] | undefined, name: keyof CommitAnswers) {
	const question = questions?.find((candidate) => candidate.name === name)

	if (question === undefined) {
		throw new Error(`Вопрос "${name}" не найден`)
	}

	return question
}

describe('адаптер CommonJS', () => {
	it('экспортирует обязательную функцию prompter', () => {
		expect(prompter).toBeTypeOf('function')
	})
})

describe('конфигурация Commitizen в package.json', () => {
	it('использует локальный адаптер без прямой зависимости от cz-conventional-changelog', () => {
		expect(packageJson.config.commitizen.path).toBe('./commitizen-adapter.cjs')
		expect(Object.hasOwn(packageJson.devDependencies, 'cz-conventional-changelog')).toBe(false)
	})
})

describe('getOpenSpecChanges', () => {
	it('возвращает отсортированные каталоги и исключает archive', () => {
		const changesDirectory = createChangesDirectory()

		expect(getOpenSpecChanges(changesDirectory)).toStrictEqual(['alpha-change', 'zeta-change'])
	})

	it('возвращает понятную ошибку, если каталог недоступен', () => {
		expect(() => getOpenSpecChanges('/missing/openspec/changes')).toThrow(
			'Не удалось прочитать OpenSpec changes',
		)
	})
})

describe('buildCommitMessage', () => {
	const baseAnswers: CommitAnswers = {
		body: '',
		change: 'community-activity-task',
		isBreaking: false,
		scope: 'catalog',
		subject: 'исправить отображение задания',
		type: 'fix',
	}

	it('добавляет Change как единственный footer', () => {
		expect(buildCommitMessage(baseAnswers)).toBe(`fix(catalog): исправить отображение задания

Change: community-activity-task`)
	})

	it('не добавляет footer, если change не выбран', () => {
		expect(buildCommitMessage({ ...baseAnswers, change: '' })).toBe(
			'fix(catalog): исправить отображение задания',
		)
	})

	it('добавляет body и Change вместе', () => {
		expect(
			buildCommitMessage({
				...baseAnswers,
				body: 'Описание изменения.',
			}),
		).toBe(`fix(catalog): исправить отображение задания

Описание изменения.

Change: community-activity-task`)
	})

	it.each([' \t ', 'BREAKING CHANGE:', 'BREAKING CHANGE:   '])(
		'не добавляет пустой BREAKING CHANGE для описания «%s»',
		(breaking) => {
			expect(
				buildCommitMessage({
					...baseAnswers,
					breaking,
					isBreaking: true,
				}),
			).toBe(`fix(catalog): исправить отображение задания

Change: community-activity-task`)
		},
	)
})

describe('createPrompter', () => {
	it('всегда задаёт вопрос Change и передаёт итоговое сообщение Commitizen', async () => {
		const changesDirectory = createChangesDirectory()
		const answers: CommitAnswers = {
			body: '',
			change: 'alpha-change',
			isBreaking: false,
			scope: '',
			subject: 'исправить каталог',
			type: 'fix',
		}
		const prompt = vi.fn(async (_questions: PromptQuestion[]) => answers)
		const commit = vi.fn()

		await createPrompter(changesDirectory)({ prompt }, commit)

		expect(prompt).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					choices: [
						{ name: 'alpha-change', value: 'alpha-change' },
						{ name: 'zeta-change', value: 'zeta-change' },
					],
					name: 'change',
					type: 'list',
				}),
			]),
		)

		const questions = prompt.mock.calls[0]?.[0]
		const changeQuestion = findPromptQuestion(questions, 'change')

		expect(Object.hasOwn(changeQuestion, 'when')).toBe(false)
		expect(commit).toHaveBeenCalledWith(`fix: исправить каталог

Change: alpha-change`)
	})

	it('передаёт ошибку чтения changes через callback Commitizen', async () => {
		const prompt = vi.fn(async (_questions: PromptQuestion[]) => {
			throw new Error('Prompt не должен вызываться')
		})
		const commit = vi.fn<Commit>()

		await expect(
			createPrompter('/missing/openspec/changes')({ prompt }, commit),
		).resolves.toBeUndefined()

		expect(prompt).not.toHaveBeenCalled()
		expect(commit).toHaveBeenCalledTimes(1)
		const [error] = commit.mock.calls[0] ?? []

		expect(error).toBeInstanceOf(Error)

		if (!(error instanceof Error)) {
			throw new Error('Commitizen должен получить Error')
		}

		expect(error.message).toContain('Не удалось прочитать OpenSpec changes')
	})

	it('передаёт rejected prompt через callback Commitizen', async () => {
		const changesDirectory = createChangesDirectory()
		const promptFailure: unknown = 'Не удалось получить ответы Commitizen'
		const prompt = vi.fn(async (_questions: PromptQuestion[]) => {
			throw promptFailure
		})
		const commit = vi.fn<Commit>()

		await expect(createPrompter(changesDirectory)({ prompt }, commit)).resolves.toBeUndefined()

		expect(commit).toHaveBeenCalledTimes(1)
		const [error] = commit.mock.calls[0] ?? []

		expect(error).toBeInstanceOf(Error)

		if (!(error instanceof Error)) {
			throw new Error('Commitizen должен получить Error')
		}

		expect(error.message).toBe('Не удалось получить ответы Commitizen')
	})

	it('требует непустое описание breaking change', async () => {
		const changesDirectory = createChangesDirectory()
		const answers: CommitAnswers = {
			body: '',
			change: '',
			isBreaking: true,
			scope: '',
			subject: 'изменить API',
			type: 'feat',
		}
		const prompt = vi.fn(async (_questions: PromptQuestion[]) => answers)

		await createPrompter(changesDirectory)({ prompt }, vi.fn())

		const questions = prompt.mock.calls[0]?.[0]
		const breakingQuestion = findPromptQuestion(questions, 'breaking')

		expect(breakingQuestion.validate?.(' \t ')).toBe('Описание breaking change обязательно')
		expect(breakingQuestion.validate?.('BREAKING CHANGE:')).toBe(
			'Описание breaking change обязательно',
		)
		expect(breakingQuestion.validate?.('BREAKING CHANGE:   ')).toBe(
			'Описание breaking change обязательно',
		)
		expect(breakingQuestion.validate?.('изменить контракт')).toBe(true)
		expect(breakingQuestion.validate?.('BREAKING CHANGE: изменить контракт')).toBe(true)
	})
})
