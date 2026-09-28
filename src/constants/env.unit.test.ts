import { describe, expect, it, vi } from 'vitest'

import { PRODUCTION_APP_NAME } from '#/constants/env'

async function loadIsProductionApp(appName: string) {
	vi.resetModules()
	vi.doMock('#/env/client', () => ({
		clientEnvironment: { NEXT_PUBLIC_APP_NAME: appName },
	}))

	const { isProductionApp } = await import('#/constants/env')

	return isProductionApp
}

describe('isProductionApp', () => {
	it('распознаёт production-стенд по его идентификатору', async () => {
		await expect(loadIsProductionApp(PRODUCTION_APP_NAME)).resolves.toBe(true)
	})

	it('не считает production любой другой стенд', async () => {
		for (const appName of ['starskills-local', 'staging', '']) {
			await expect(loadIsProductionApp(appName)).resolves.toBe(false)
		}
	})
})
