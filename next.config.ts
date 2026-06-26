import type { NextConfig } from 'next'

import { fileURLToPath } from 'node:url'

import { withSentryConfig } from '@sentry/nextjs'
import { nanoid } from 'nanoid'

import { headers } from './headers'
import { clientEnvironment } from './src/env/client'
import { serverEnvironment } from './src/env/server'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const svgrOptions = {
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
}

const nextConfig: NextConfig = {
	cacheComponents: false,
	cleanDistDir: true,
	devIndicators: { position: 'top-right' },
	experimental: {
		serverSourceMaps: true,
		optimizePackageImports: [],
	},
	generateBuildId: () => `${nanoid()}-${Date.now()}`,
	headers,
	images: {
		disableStaticImages: true,
		dangerouslyAllowSVG: true,
		remotePatterns: [{ protocol: 'https', hostname: 'storage.yandexcloud.net' }],
		qualities: [75, 100],
	},
	logging: isDev
		? { browserToTerminal: true, serverFunctions: true, fetches: { fullUrl: true } }
		: false,
	output: 'standalone',
	outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
	poweredByHeader: false,
	reactProductionProfiling: false,
	reactStrictMode: true,
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: `${clientEnvironment.NEXT_PUBLIC_BFF_PATH}/:path*`,
					destination: `${serverEnvironment.BACK_INTERNAL_URL ?? clientEnvironment.NEXT_PUBLIC_BACK_URL}/:path*`,
				},
			],
		}
	},
	serverExternalPackages: [
		'pg',
		'pg-pool',
		'pg-types',
		'pg-protocol',
		'pg-connection-string',
		'pgpass',
	],
	transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
	typedRoutes: true,
	turbopack: {
		rules: {
			'*.svg': {
				loaders: [
					{
						loader: '@svgr/webpack',
						options: svgrOptions,
					},
				],
				as: '*.js',
			},
		},
	},
}

function withSentry(config: NextConfig) {
	if (clientEnvironment.NEXT_PUBLIC_SENTRY_DSN == null || !isProd) return config

	return withSentryConfig(config, {
		authToken: serverEnvironment.SENTRY_AUTH_TOKEN,
		bundleSizeOptimizations: {
			excludeDebugStatements: true,
			excludeReplayShadowDom: true,
			excludeReplayIframe: true,
		},
		org: serverEnvironment.SENTRY_ORG,
		sentryUrl: serverEnvironment.SENTRY_URL,
		project: clientEnvironment.NEXT_PUBLIC_APP_NAME,
		silent: true,
		sourcemaps: { deleteSourcemapsAfterUpload: true },
		telemetry: false,
		widenClientFileUpload: true,
	})
}

export default withSentry(nextConfig)
