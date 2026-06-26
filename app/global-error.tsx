'use client'

import { ErrorFallback } from '#/components/utilities/error-boundary'
import { ttFors } from '#/fonts/ttFors'

interface GlobalErrorProps {
	error: { digest?: string } & Error
	reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	return (
		<html lang="ru" data-scroll-behavior="smooth" className={ttFors.variable}>
			<body className="tw:font-sans tw:text-text-default tw:antialiased">
				<div className={`tw:relative tw:v-stack tw:bg-bg-gray-ultralight`}>
					<main className="tw:page-container tw:v-stack tw:min-h-svh tw:items-center tw:justify-center">
						<ErrorFallback error={error} resetError={reset} />
					</main>
				</div>
			</body>
		</html>
	)
}
