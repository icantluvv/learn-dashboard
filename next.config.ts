import type { NextConfig } from 'next'

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
		optimizePackageImports: [],
		serverSourceMaps: true,
	},
	generateBuildId: () => `${nanoid()}-${Date.now()}`,
	headers,
	images: {
		dangerouslyAllowSVG: true,
		disableStaticImages: true,
		qualities: [75, 100],
		remotePatterns: [{ hostname: 'storage.yandexcloud.net', protocol: 'https' }],
	},
	logging: isDev
		? { browserToTerminal: true, fetches: { fullUrl: true }, serverFunctions: true }
		: false,
	output: 'standalone',
	outputFileTracingRoot: import.meta.dirname,
	poweredByHeader: false,
	reactProductionProfiling: false,
	reactStrictMode: true,
	async rewrites() {
		return {
			beforeFiles: [
				{
					destination: `${serverEnvironment.BACK_INTERNAL_URL ?? clientEnvironment.NEXT_PUBLIC_BACK_URL}/:path*`,
					source: `${clientEnvironment.NEXT_PUBLIC_BFF_PATH ?? ''}/:path*`,
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
	turbopack: {
		rules: {
			'*.svg': {
				as: '*.js',
				loaders: [
					{
						loader: '@svgr/webpack',
						options: svgrOptions,
					},
				],
			},
		},
	},
	typedRoutes: true,
}

function withSentry(config: NextConfig) {
	if (clientEnvironment.NEXT_PUBLIC_SENTRY_DSN == null || !isProd) {
		return config
	}

	return withSentryConfig(config, {
		authToken: serverEnvironment.SENTRY_AUTH_TOKEN,
		bundleSizeOptimizations: {
			excludeDebugStatements: true,
			excludeReplayIframe: true,
			excludeReplayShadowDom: true,
		},
		org: serverEnvironment.SENTRY_ORG,
		project: clientEnvironment.NEXT_PUBLIC_APP_NAME,
		sentryUrl: serverEnvironment.SENTRY_URL,
		silent: true,
		sourcemaps: { deleteSourcemapsAfterUpload: true },
		telemetry: false,
		widenClientFileUpload: true,
	})
}

export default withSentry(nextConfig)
