'use client'

import { ErrorFallback } from '#/components/utilities/error-boundary'
import { ttFors } from '#/fonts/ttFors'

interface GlobalErrorProps {
	error: Error & { digest?: string }
	reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	return (
		<html lang="ru" data-scroll-behavior="smooth" className={ttFors.variable}>
			<body className="font-sans text-foreground antialiased">
				<div className="relative v-stack bg-gray-ultralight">
					<main className="page-wrapper v-stack min-h-svh items-center justify-center">
						<ErrorFallback error={error} resetError={reset} />
					</main>
				</div>
			</body>
		</html>
	)
}
