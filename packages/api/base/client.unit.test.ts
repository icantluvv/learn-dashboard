import * as allure from 'allure-js-commons'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getBaseUrl', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetModules()
	})

	it('resolves catalog paths to same-origin regardless of environment', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'catalog-data' },
			{ name: 'story', value: 'route catalog API requests to same origin' },
			{ name: 'severity', value: 'critical' },
		)
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/cores')).toBe('')
		expect(getBaseUrl('/api/skills')).toBe('')
		expect(getBaseUrl('/api/skills/js-closures')).toBe('')
	})

	it('does not treat unrelated paths as same-origin', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'api-client' },
			{ name: 'story', value: 'keep unrelated API requests on configured backend' },
			{ name: 'severity', value: 'normal' },
		)
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/skillsx')).not.toBe('')
		expect(getBaseUrl(undefined)).not.toBe('')
	})

	it('falls back to BACK_INTERNAL_URL on the server for non-skills paths', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'api-client' },
			{ name: 'story', value: 'use internal backend URL on server' },
			{ name: 'severity', value: 'normal' },
		)
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
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'authentication' },
			{ name: 'story', value: 'recognize same-origin authentication paths' },
			{ name: 'severity', value: 'critical' },
		)
		const { isAuthPath } = await import('./client')

		expect(isAuthPath('/api/me')).toBe(true)
		expect(isAuthPath('/api/auth/sign-in/email')).toBe(true)
	})

	it('does not match application endpoints', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'authentication' },
			{ name: 'story', value: 'exclude application endpoints from auth paths' },
			{ name: 'severity', value: 'normal' },
		)
		const { isAuthPath } = await import('./client')

		expect(isAuthPath('/api/skills')).toBe(false)
		expect(isAuthPath('/api/members')).toBe(false)
		expect(isAuthPath(undefined)).toBe(false)
	})

	it('keeps auth endpoints same-origin so they reach this app, not the backend', async () => {
		await allure.labels(
			{ name: 'layer', value: 'unit' },
			{ name: 'feature', value: 'authentication' },
			{ name: 'story', value: 'route authentication API requests to same origin' },
			{ name: 'severity', value: 'critical' },
		)
		const { getBaseUrl } = await import('./client')

		expect(getBaseUrl('/api/me')).toBe('')
		expect(getBaseUrl('/api/auth/get-session')).toBe('')
	})
})
