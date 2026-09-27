import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { headers } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { QueryProvider } from '#/components/providers/query-provider'
import { ThemeProvider } from '#/components/providers/theme-provider'
import { Toaster } from '#/components/toaster'
import { ttFors } from '#/fonts/ttFors'
import { SsrWidthProvider } from '#/hooks/use-ssr-width'
import { getSsrWidthFromUserAgent } from '#/lib/get-ssr-width-from-user-agent'

import './globals.css'

export const viewport: Viewport = {
	viewportFit: 'cover',
	themeColor: [
		{ color: '#f1f1f3', media: '(prefers-color-scheme: light)' },
		{ color: '#1c2637', media: '(prefers-color-scheme: dark)' },
	],
}

export const metadata: Metadata = {
	title: 'Learn Frontend',
	description: 'Service for learning frontend development',
	appleWebApp: {
		capable: true,
		title: 'Learn Frontend',
		statusBarStyle: 'black-translucent',
	},
	icons: {
		icon: [
			{ url: '/icon.svg', type: 'image/svg+xml' },
			{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
			{ url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
		],
		apple: '/apple-touch-icon.png',
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
			lang="en"
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
