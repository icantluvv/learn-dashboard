import factory from '@antfu/eslint-config'
import configPrettier from 'eslint-config-prettier'
import pluginTailwindcss from 'eslint-plugin-better-tailwindcss'

const pluginPreferTemplate = {
	rules: {
		'multiline-classname': {
			meta: { type: 'suggestion', fixable: 'code', schema: [] },
			create(context) {
				return {
					JSXAttribute(node) {
						if (node.name?.type !== 'JSXIdentifier' || node.name.name !== 'className')
							return

						if (
							node.value?.type === 'Literal' &&
							typeof node.value.value === 'string' &&
							node.value.value.includes('\n')
						) {
							const raw = node.value.value

							context.report({
								node: node.value,
								message:
									'Multiline className strings can cause hydration errors.' +
									' Use a template literal/expression instead.',
								fix(fixer) {
									const escaped = raw
										.replace(/`/g, '\\`')
										.replace(/\$\{/g, '\\${')
									return fixer.replaceText(node.value, `{\`${escaped}\`}`)
								},
							})
						}
					},
				}
			},
		},
	},
}

export default factory(
	{
		ignores: ['**/codegen/**'],
		imports: { 'import/newline-after-import': ['error', { count: 1 }] },
		jsonc: false,
		jsx: { a11y: true },
		nextjs: true,
		perfectionist: { overrides: { 'perfectionist/sort-imports': 'off' } },
		react: true,
		javascript: { overrides: { 'no-console': 'error' } },
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'zod',
							message: 'Используй zod/mini вместо zod',
						},
					],
					patterns: [
						{
							group: ['**/packages/api', '**/packages/api/**'],
							message: 'Используй @repo/api вместо прямого пути',
						},
						{
							group: ['**/packages/logger', '**/packages/logger/**'],
							message: 'Используй @repo/logger вместо прямого пути',
						},
						{
							group: ['../**/src', '../**/src/**', '~/src', '~/src/**'],
							message: 'Используй алиас #/ для импортов из src/',
						},
						{
							group: ['../**/app', '../**/app/**', '~/app', '~/app/**'],
							message: 'Используй алиас @/ для импортов из app/',
						},
					],
				},
			],

			'antfu/curly': 'error',
			'antfu/top-level-function': 'error',

			'node/prefer-global/process': 'off',
		},
		stylistic: false,
		typescript: { erasableOnly: true, tsconfigPath: 'tsconfig.json' },
	},
	{
		extends: [pluginTailwindcss.configs.recommended],
		plugins: {
			'prefer-template': pluginPreferTemplate,
		},
		rules: {
			'better-tailwindcss/enforce-canonical-classes': 'off',
			'better-tailwindcss/enforce-consistent-class-order': 'off',
			'better-tailwindcss/enforce-consistent-line-wrapping': [
				'error',
				{ printWidth: 100, indent: 'tab', tabWidth: 4, strictness: 'loose' },
			],
			'better-tailwindcss/no-unknown-classes': ['error', { ignore: ['^tw:.*', '^cn-.*'] }],
			'prefer-template/multiline-classname': 'error',
		},
		settings: {
			'better-tailwindcss': {
				tsconfig: 'tsconfig.json',
				entryPoint: 'app/globals.css',
			},
		},
	},
	configPrettier,
)
