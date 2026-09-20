import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { render } from 'vitest-browser-react'

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			mutations: {
				retry: false,
			},
			queries: {
				retry: false,
			},
		},
	})
}

interface RenderOptions {
	searchParams?: string
}

export async function renderWithProviders(ui: ReactNode, options: RenderOptions = {}) {
	const queryClient = createTestQueryClient()

	return render(ui, {
		wrapper: ({ children }) => (
			<NuqsTestingAdapter searchParams={options.searchParams}>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</NuqsTestingAdapter>
		),
	})
}
