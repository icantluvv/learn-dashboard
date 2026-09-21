const TRAILER_PATTERN = /^(?:[A-Za-z][A-Za-z0-9-]*|BREAKING CHANGE): .+$/
const CHANGE_TRAILER_PATTERN = /^Change: \S(?:.*\S)?$/

const ERROR_MESSAGE = `footer коммита должен содержать строку:
Change: <название-чейнджа>`

function getLines(raw) {
	return raw.replaceAll(/\r\n?/g, '\n').trimEnd().split('\n')
}

function getFooterLines(lines) {
	const separatorIndex = lines.findLastIndex((line) => line.trim() === '')

	if (separatorIndex <= 0 || separatorIndex === lines.length - 1) {
		return []
	}

	const footerLines = lines.slice(separatorIndex + 1)

	return footerLines.every((line) => TRAILER_PATTERN.test(line)) ? footerLines : []
}

/**
 * @param {{ raw?: string }} options Параметры правила.
 * @returns {[boolean, string]} Результат валидации и сообщение об ошибке.
 */
export function requiredTrailersRule({ raw = '' }) {
	const lines = getLines(raw)
	const footerLines = getFooterLines(lines)
	const changeTrailers = footerLines.filter((line) => line.startsWith('Change:'))
	const valid = changeTrailers.length === 1 && CHANGE_TRAILER_PATTERN.test(changeTrailers[0])

	return [valid, ERROR_MESSAGE]
}

const config = {
	plugins: [
		{
			rules: {
				'required-trailers': requiredTrailersRule,
			},
		},
	],
	rules: {
		'required-trailers': [2, 'always'],
	},
}

export default config
