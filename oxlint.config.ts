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
})
