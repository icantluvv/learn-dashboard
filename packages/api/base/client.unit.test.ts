import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getBaseUrl', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetModules()
	})

	it('resolves skills paths to same-origin regardless of environment', async () => {
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/skills')).toBe('')
		expect(getBaseUrl('/api/skills/js-closures')).toBe('')
	})

	it('does not treat unrelated paths as same-origin', async () => {
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/skillsx')).not.toBe('')
		expect(getBaseUrl(undefined)).not.toBe('')
	})

	it('falls back to BACK_INTERNAL_URL on the server for non-skills paths', async () => {
		vi.stubGlobal('window', undefined)
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/example')).toBe(process.env.BACK_INTERNAL_URL)
	})
})
