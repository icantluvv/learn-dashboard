// https://vitest.dev/config/
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { isAgent } from 'std-env'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

const sonnerMock = fileURLToPath(new URL('./src/test/mocks/sonner.ts', import.meta.url))
const nextNavigationMock = fileURLToPath(
	new URL('./src/test/mocks/next-navigation.ts', import.meta.url),
)
const nextScriptMock = fileURLToPath(new URL('./src/test/mocks/next-script.tsx', import.meta.url))
const nextImageMock = fileURLToPath(new URL('./src/test/mocks/next-image.tsx', import.meta.url))
const dobroUiIconsMock = fileURLToPath(
	new URL('./src/test/mocks/dobro-ui-icons.tsx', import.meta.url),
)
const dotEnvPath = new URL('./.env', import.meta.url)

const testExclude = [
	'**/.next/**',
	'**/allure-results/**',
	'**/blob-report/**',
	'**/coverage/**',
	'**/dist/**',
	'**/node_modules/**',
	'**/playwright-report/**',
	'**/test-results/**',
]

const testEnvironmentKeys = [
	'BACK_INTERNAL_URL',
	'BACK_INTERNAL_BASIC_AUTH',
	'MOCK_MODE',
	'SENTRY_ORG',
	'SENTRY_URL',
	'SENTRY_AUTH_TOKEN',
	'DATABASE_URL',
	'BETTER_AUTH_DATABASE_POOL_MAX',
	'BETTER_AUTH_DATABASE_POOL_IDLE_TIMEOUT_MS',
	'BETTER_AUTH_DATABASE_POOL_CONNECTION_TIMEOUT_MS',
	'BETTER_AUTH_DATABASE_POOL_MAX_LIFETIME_SECONDS',
	'BETTER_AUTH_DATABASE_POOL_METRICS_INTERVAL_MS',
	'BETTER_AUTH_URL',
	'BETTER_AUTH_SECRET',
	'DOBRO_AUTHORIZATION_URL',
	'DOBRO_CLIENT_ID',
	'DOBRO_CLIENT_SECRET',
	'DOBRO_TOKEN_URL',
	'DOBRO_USERINFO_URL',
	'DOBRO_INTERNAL_BASE_URL',
	'DADATA_URL',
	'DADATA_TOKEN',
	'PARTNER_API_TOKEN',
	'UNLEASH_SERVER_API_URL',
	'UNLEASH_SERVER_API_TOKEN',
	'UNLEASH_APP_NAME',
	'NEXT_PUBLIC_APP_NAME',
	'NEXT_PUBLIC_FRONT_URL',
	'NEXT_PUBLIC_BFF_PATH',
	'NEXT_PUBLIC_BACK_URL',
	'NEXT_PUBLIC_MOCK_MODE',
	'NEXT_PUBLIC_SENTRY_DSN',
	'NEXT_PUBLIC_S3_URL',
	'NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL',
	'NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN',
	'NEXT_PUBLIC_UNLEASH_APP_NAME',
] as const

const dotEnvEnvironment = existsSync(dotEnvPath) ? parseEnv(readFileSync(dotEnvPath, 'utf8')) : {}

const testEnvironment = Object.fromEntries(
	testEnvironmentKeys.flatMap((key) => {
		const value = process.env[key] ?? dotEnvEnvironment[key]

		return value === undefined ? [] : [[key, value]]
	}),
)

const testProcessEnvironment: Partial<NodeJS.ProcessEnv> = {
	NODE_ENV: 'test',
	...testEnvironment,
}

export default defineConfig({
	define: {
		__BCP_TEST_ENV__: JSON.stringify(testProcessEnvironment),
	},
	optimizeDeps: {
		exclude: ['@faker-js/faker', 'undici'],
		include: [
			'@wavesurfer/react',
			'adze',
			'better-auth/cookies',
			'better-auth/client/plugins',
			'better-auth/react',
			'class-variance-authority',
			'nanoid',
			'next/headers',
			'next/link',
			'next/link.js',
			'nuqs',
			'nuqs/adapters/testing',
			'nuqs/server',
		],
	},
	plugins: [
		react(),
		svgr({
			include: '**/*.svg',
			svgrOptions: {
				svgoConfig: {
					plugins: [
						{
							name: 'preset-default',
							params: {
								overrides: {
									removeViewBox: false,
								},
							},
						},
					],
				},
			},
		}),
	],
	resolve: {
		alias: [
			{ find: /^@dobro\/dobro-ui\/icons\/.+$/, replacement: dobroUiIconsMock },
			{ find: /^next\/navigation$/, replacement: nextNavigationMock },
			{ find: /^next\/script$/, replacement: nextScriptMock },
			{ find: /^next\/image$/, replacement: nextImageMock },
			{ find: /^sonner$/, replacement: sonnerMock },
		],
		tsconfigPaths: true,
	},
	test: {
		clearMocks: true,
		coverage: {
			exclude: [
				...testExclude,
				'**/*.d.ts',
				'**/*.{test,spec}.{ts,tsx}',
				'**/*.stories.{ts,tsx}',
				'**/codegen/**',
				'**/openapi/**',
				'**/*.config.{ts,tsx,mts,cts,js,mjs,cjs}',
				'next-env.d.ts',
				'src/fonts/**',
				'src/styles/**',
			],
			include: ['app/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
			provider: 'v8',
			reporter: ['text', 'html', 'lcov', 'json', 'json-summary', 'cobertura'],
			reportsDirectory: './coverage/vitest',
		},
		css: true,
		env: testProcessEnvironment,
		deps: {
			optimizer: {
				client: {
					enabled: true,
					include: [
						'@faker-js/faker',
						'@sentry/nextjs',
						'@wavesurfer/react',
						'adze',
						'better-auth/cookies',
						'better-auth/client/plugins',
						'better-auth/react',
						'class-variance-authority',
						'nanoid',
						'next/dist/client/components/navigation',
						'next/dist/client/link',
						'next/dist/shared/lib/app-router-context.shared-runtime',
						'next/headers',
						'next/link',
						'next/link.js',
						'nuqs',
						'nuqs/adapters/testing',
						'nuqs/server',
						'vitest-browser-react',
					],
				},
			},
		},
		globals: true,
		setupFiles: ['./src/test/setup-env.ts'],
		outputFile: {
			json: './test-results/vitest.json',
			junit: './test-results/vitest.junit.xml',
		},
		projects: [
			{
				extends: true,
				test: {
					environment: 'node',
					exclude: testExclude,
					include: ['**/*.unit.test.{ts,tsx}'],
					name: 'unit',
					setupFiles: [
						'allure-vitest/setup',
						'./src/test/setup-env.ts',
						'./src/test/setup-allure-unit.ts',
					],
				},
			},
			{
				extends: true,
				test: {
					browser: {
						enabled: true,
						headless: true,
						instances: [{ browser: 'chromium' }],
						provider: playwright(),
					},
					exclude: testExclude,
					include: ['**/*.component.test.{ts,tsx}'],
					name: 'component',
					setupFiles: [
						'allure-vitest/browser/setup',
						'./src/test/setup-env.ts',
						'./src/test/setup-browser.ts',
						'./src/test/setup-allure-component.ts',
					],
				},
			},
		],
		reporters: isAgent
			? ['agent']
			: [
					'default',
					'junit',
					'json',
					['allure-vitest/reporter', { resultsDir: './allure-results' }],
				],
		restoreMocks: true,
		unstubGlobals: true,
	},
})
