import { describe, expect, it } from 'vitest'

describe('component test setup', () => {
	it('подключает глобальные стили приложения', () => {
		const probe = document.createElement('div')
		probe.className = 'tw:text-text-label'
		document.body.append(probe)

		try {
			expect(
				getComputedStyle(document.documentElement)
					.getPropertyValue('--color-text-default')
					.trim(),
			).toBe('#202020')
		} finally {
			probe.remove()
		}
	})
})
