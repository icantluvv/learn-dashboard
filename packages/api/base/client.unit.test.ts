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

describe('isAuthPath', () => {
	afterEach(() => {
		vi.resetModules()
	})

	it('matches the contract profile endpoint and the Better Auth handler', async () => {
		const { isAuthPath } = await import('./client')

		expect(isAuthPath('/api/me')).toBe(true)
		expect(isAuthPath('/api/auth/sign-in/email')).toBe(true)
	})

	it('does not match application endpoints', async () => {
		const { isAuthPath } = await import('./client')

		expect(isAuthPath('/api/skills')).toBe(false)
		expect(isAuthPath('/api/members')).toBe(false)
		expect(isAuthPath(undefined)).toBe(false)
	})

	it('keeps auth endpoints same-origin so they reach this app, not the backend', async () => {
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/me')).toBe('')
		expect(getBaseUrl('/api/auth/get-session')).toBe('')
	})
})
