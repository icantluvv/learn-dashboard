import { describe, expect, it } from 'vitest'

import { isActiveRoute } from './is-active-route'

describe('isActiveRoute', () => {
	it.each([
		['/', '/', true],
		['/catalog', '/', false],
		['/catalog/abc', '/', false],
		['/sign-in', '/', false],
		['/catalog', '/catalog', true],
		['/catalog/abc', '/catalog', true],
		['/catalog/abc/def', '/catalog', true],
		['/catalogue', '/catalog', false],
		['/sign-in', '/catalog', false],
	])('isActiveRoute(%s, %s) === %s', (pathname, href, expected) => {
		expect(isActiveRoute(pathname, href)).toBe(expected)
	})
})
