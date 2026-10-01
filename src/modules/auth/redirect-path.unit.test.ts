import { describe, expect, it } from 'vitest'

import { resolveRedirectPath } from './redirect-path'

describe('resolveRedirectPath', () => {
	it('принимает внутренний путь', () => {
		expect(resolveRedirectPath('/catalog/frontend/js-closures')).toBe(
			'/catalog/frontend/js-closures',
		)
	})

	it('сохраняет query и hash внутреннего пути', () => {
		expect(resolveRedirectPath('/catalog/frontend?difficulty=easy#questions')).toBe(
			'/catalog/frontend?difficulty=easy#questions',
		)
	})

	it.each([
		['//evil.example', 'protocol-relative адрес'],
		[String.raw`/\evil.example`, 'адрес с обратным слешем'],
		['https://evil.example', 'абсолютный адрес'],
		['http://evil.example/catalog', 'абсолютный адрес с путём'],
		['javascript:alert(1)', 'иная схема'],
		['catalog/frontend', 'относительный путь без ведущего слеша'],
		['', 'пустая строка'],
	])('отвергает %s (%s)', (value) => {
		expect(resolveRedirectPath(value)).toBe('/')
	})

	it.each(['/sign-in', '/sign-up', '/sign-in?next=/profile'])(
		'отвергает возврат на страницу аутентификации %s',
		(value) => {
			expect(resolveRedirectPath(value)).toBe('/')
		},
	)

	it('отвергает отсутствующее значение', () => {
		expect(resolveRedirectPath(undefined)).toBe('/')
	})

	it('отвергает повторяющийся параметр, пришедший массивом', () => {
		expect(resolveRedirectPath(['/profile', '//evil.example'])).toBe('/')
	})
})
