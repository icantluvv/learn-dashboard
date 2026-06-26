import type { MockRoute, RequestMethod } from './mock-client'

export type BaseMockScenarioName = 'default'

export const activeBaseMockScenario: BaseMockScenarioName = 'default'
export const notificationsMockScenario: BaseMockScenarioName = 'default'

// Example scenario — add routes here to intercept API calls in mock mode.
// Each route matches a method + URL pattern and returns stubbed data via `create`.
const mockScenarios = {
	default: [
		// {
		//     method: 'GET',
		//     pattern: /^\/api\/v1\/me\/profile$/,
		//     create: () => ({ id: '123', name: 'Test User' }),
		// },
	],
} satisfies Record<BaseMockScenarioName, MockRoute[]>

const alwaysActiveMockRoutes: MockRoute[] = []

export function isBaseMockScenarioName(
	value: string | null | undefined,
): value is BaseMockScenarioName {
	return value != null && new Set(Object.keys(mockScenarios)).has(value)
}

export function getMockScenarioRoute(
	method: RequestMethod,
	path: string,
	scenario: BaseMockScenarioName = activeBaseMockScenario,
): MockRoute | undefined {
	return [
		...mockScenarios[scenario],
		...mockScenarios[notificationsMockScenario],
		...alwaysActiveMockRoutes,
	].find((route) => route.method === method && route.pattern.test(path))
}
