const { readdirSync } = require('node:fs')
const path = require('node:path')

const OPEN_SPEC_CHANGES_DIRECTORY = path.resolve(__dirname, 'openspec/changes')
const HEADER_MAX_LENGTH = 100
const LINE_MAX_LENGTH = 100

const COMMIT_TYPES = [
	{ name: 'feat:     новая функциональность', value: 'feat' },
	{ name: 'fix:      исправление ошибки', value: 'fix' },
	{ name: 'docs:     документация', value: 'docs' },
	{ name: 'style:    форматирование без изменения поведения', value: 'style' },
	{ name: 'refactor: рефакторинг', value: 'refactor' },
	{ name: 'perf:     улучшение производительности', value: 'perf' },
	{ name: 'test:     тесты', value: 'test' },
	{ name: 'build:    сборка и зависимости', value: 'build' },
	{ name: 'ci:       CI-конфигурация', value: 'ci' },
	{ name: 'chore:    прочие технические изменения', value: 'chore' },
	{ name: 'revert:   откат изменения', value: 'revert' },
]

function normalizeSubject(value) {
	const subject = value.trim().replace(/\.+$/, '')

	return subject ? subject.charAt(0).toLowerCase() + subject.slice(1) : ''
}

function normalizeBreakingDescription(value = '') {
	return value.trim().replace(/^BREAKING CHANGE:\s*/, '')
}

function normalizeError(error) {
	return error instanceof Error ? error : new Error(String(error))
}

function maxSubjectLength(answers) {
	const scopeLength = answers.scope ? answers.scope.trim().length + 2 : 0

	return HEADER_MAX_LENGTH - answers.type.length - scopeLength - 2
}

function wrapText(value) {
	return value
		.trim()
		.split('\n')
		.map((line) => {
			const words = line.trim().split(/\s+/).filter(Boolean)

			const lines = []

			for (const word of words) {
				const currentLine = lines.at(-1)

				if (!currentLine || currentLine.length + word.length + 1 > LINE_MAX_LENGTH) {
					lines.push(word)
				} else {
					lines[lines.length - 1] = `${currentLine} ${word}`
				}
			}

			return lines.join('\n')
		})
		.join('\n')
}

function getOpenSpecChanges(changesDirectory = OPEN_SPEC_CHANGES_DIRECTORY) {
	try {
		return readdirSync(changesDirectory, { withFileTypes: true })
			.filter((entry) => entry.isDirectory() && entry.name !== 'archive')
			.map((entry) => entry.name)
			.sort((left, right) => left.localeCompare(right, 'en'))
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error)

		throw new Error(`Не удалось прочитать OpenSpec changes: ${reason}`, { cause: error })
	}
}

function buildCommitMessage(answers) {
	const scope = answers.scope.trim().toLowerCase()
	const header = `${answers.type}${scope ? `(${scope})` : ''}: ${normalizeSubject(answers.subject)}`
	const body = answers.body || answers.breakingBody
	const breakingDescription = normalizeBreakingDescription(answers.breaking)
	const breaking =
		answers.isBreaking && breakingDescription ? `BREAKING CHANGE: ${breakingDescription}` : ''
	const change = answers.change.trim()
	const footer = change ? `Change: ${change}` : ''
	const sections = [
		header,
		body ? wrapText(body) : '',
		breaking ? wrapText(breaking) : '',
		footer,
	].filter(Boolean)

	return sections.join('\n\n')
}

function createPrompter(changesDirectory = OPEN_SPEC_CHANGES_DIRECTORY) {
	return async (cz, commit) => {
		let finalAnswers

		try {
			const changeChoices = getOpenSpecChanges(changesDirectory).map((change) => ({
				name: change,
				value: change,
			}))

			finalAnswers = await cz.prompt([
				{
					type: 'list',
					name: 'type',
					message: 'Выберите тип изменения:',
					choices: COMMIT_TYPES,
				},
				{
					type: 'input',
					name: 'scope',
					message: 'Укажите область изменения (Enter, чтобы пропустить):',
					filter: (value) => value.trim().toLowerCase(),
				},
				{
					type: 'input',
					name: 'subject',
					message: 'Кратко опишите изменение:',
					filter: normalizeSubject,
					validate: (value, answers) => {
						const subject = normalizeSubject(value)
						const maximum = maxSubjectLength(answers)

						if (!subject) {
							return 'Описание обязательно'
						}
						return (
							subject.length <= maximum ||
							`Описание должно быть не длиннее ${maximum} символов`
						)
					},
				},
				{
					type: 'input',
					name: 'body',
					message: 'Добавьте подробное описание (Enter, чтобы пропустить):',
				},
				{
					type: 'confirm',
					name: 'isBreaking',
					message: 'Есть ли breaking changes?',
					default: false,
				},
				{
					type: 'input',
					name: 'breakingBody',
					message: 'Для breaking change добавьте подробное описание:',
					default: '-',
					when: (answers) => answers.isBreaking && !answers.body,
					validate: (value) =>
						value.trim().length > 0 || 'Подробное описание обязательно',
				},
				{
					type: 'input',
					name: 'breaking',
					message: 'Опишите breaking change:',
					when: (answers) => answers.isBreaking,
					validate: (value) =>
						normalizeBreakingDescription(value).length > 0 ||
						'Описание breaking change обязательно',
				},
				{
					type: 'list',
					name: 'change',
					message: 'Выберите OpenSpec change:',
					choices: changeChoices,
				},
			])
		} catch (error) {
			commit(normalizeError(error))
			return
		}

		commit(buildCommitMessage(finalAnswers))
	}
}

module.exports = {
	buildCommitMessage,
	createPrompter,
	getOpenSpecChanges,
	prompter: createPrompter(),
}
