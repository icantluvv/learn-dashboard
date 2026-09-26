import { test as base } from '@playwright/test'

/**
 * The Next.js dev indicator is pinned to the top-right corner by `next.config.ts` and sits exactly
 * over the header's profile button, swallowing clicks. It is dev-only chrome, so E2E hides it.
 */
export const test = base.extend({
	page: async ({ page }, runTest) => {
		await page.addInitScript(() => {
			const css = 'nextjs-portal { display: none !important; }'

			const inject = () => {
				const style = document.createElement('style')
				style.textContent = css
				document.head.append(style)
			}

			if (document.head == null) {
				document.addEventListener('DOMContentLoaded', inject, { once: true })
			} else {
				inject()
			}
		})

		await runTest(page)
	},
})

export { expect } from '@playwright/test'
