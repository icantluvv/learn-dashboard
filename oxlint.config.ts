import { defineOxlintConfig } from '@webpractik/oxlint-config'

export default defineOxlintConfig({
	ignores: ['**/codegen/**'],
	jsxA11y: true,
	nextjs: true,
	oxc: { overrides: { 'oxc/no-map-spread': 'off' } },
	react: { overrides: { 'react/refs': 'off' } },
	tailwindcss: { entryPoint: 'app/globals.css' },
	typescript: { tsconfigPath: 'tsconfig.json' },
	unicorn: { overrides: { 'unicorn/no-nested-ternary': 'off' } },
	rules: {
		'no-console': 'error',
		'no-restricted-imports': [
			'error',
			{
				paths: [{ name: 'zod', message: 'Используй zod/mini вместо zod' }],
				patterns: [
					{
						group: ['**/packages/api', '**/packages/api/**'],
						message: 'Используй @repo/api вместо прямого пути',
					},
					{
						group: ['**/packages/core', '**/packages/core/**'],
						message: 'Используй @repo/core вместо прямого пути',
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
	},
	// Примитивы в packages/core/src/ui устанавливаются shadcn CLI и переустанавливаются
	// при `shadcn add --overwrite`. Мы дорабатываем их API, но не оформление, поэтому
	// стилевые и fast-refresh правила для них отключены точечно.
	overrides: [
		{
			files: ['packages/core/src/ui/**'],
			rules: {
				'jsx-a11y/click-events-have-key-events': 'off',
				'jsx-a11y/no-noninteractive-element-interactions': 'off',
				'prefer-template/multiline-classname': 'off',
				'react/display-name': 'off',
				'react/no-object-type-as-default-prop': 'off',
				'react/only-export-components': 'off',
				'tailwindcss/enforce-consistent-line-wrapping': 'off',
			},
		},
	],
})
