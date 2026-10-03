import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { headers } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { QueryProvider } from '#/components/providers/query-provider'
import { ThemeProvider } from '#/components/providers/theme-provider'
import { Toaster } from '#/components/toaster'
import { clientEnvironment } from '#/env/client'
import { ttFors } from '#/fonts/ttFors'
import { SsrWidthProvider } from '#/hooks/use-ssr-width'
import { getSsrWidthFromUserAgent } from '#/lib/get-ssr-width-from-user-agent'
import {
	BRAND_NAME,
	CONTENT_LANGUAGE,
	DEFAULT_TITLE,
	OG_LOCALE,
	SITE_DESCRIPTION,
	TITLE_TEMPLATE,
} from '#/seo'

import './globals.css'

export const viewport: Viewport = {
	viewportFit: 'cover',
	themeColor: [
		{ color: '#f1f1f3', media: '(prefers-color-scheme: light)' },
		{ color: '#1c2637', media: '(prefers-color-scheme: dark)' },
	],
}

export const metadata: Metadata = {
	metadataBase: new URL(clientEnvironment.NEXT_PUBLIC_FRONT_URL),
	title: {
		default: DEFAULT_TITLE,
		template: TITLE_TEMPLATE,
	},
	description: SITE_DESCRIPTION,
	applicationName: BRAND_NAME,
	openGraph: {
		type: 'website',
		siteName: BRAND_NAME,
		locale: OG_LOCALE,
		title: DEFAULT_TITLE,
		description: SITE_DESCRIPTION,
		url: '/',
	},
	twitter: {
		card: 'summary',
		title: DEFAULT_TITLE,
		description: SITE_DESCRIPTION,
	},
	appleWebApp: {
		capable: true,
		title: BRAND_NAME,
		statusBarStyle: 'black-translucent',
	},
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	const requestHeaders = await headers()
	const ssrWidth = getSsrWidthFromUserAgent(requestHeaders.get('user-agent') ?? '')

	return (
		<html
			lang={CONTENT_LANGUAGE}
			data-scroll-behavior="smooth"
			className={ttFors.variable}
			suppressHydrationWarning
		>
			<body className="v-stack min-h-full">
				<ThemeProvider>
					<SsrWidthProvider value={ssrWidth}>
						<NuqsAdapter>
							<QueryProvider>
								{children}
								<Toaster />
							</QueryProvider>
						</NuqsAdapter>
					</SsrWidthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
