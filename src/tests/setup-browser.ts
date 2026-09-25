import { afterEach } from 'vitest'

import { resetNextNavigationMock } from './mocks/next-navigation'

import '@/globals.css'

afterEach(() => {
	resetNextNavigationMock()
})
