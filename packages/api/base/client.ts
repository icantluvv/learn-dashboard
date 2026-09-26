import { isDev } from '#/constants/env'
import { clientEnvironment } from '#/env/client'
import { serverEnvironment } from '#/env/server'
import {
	getBrowserMockScenario,
	getRequestMockScenario,
	isBrowserRuntimeMockModeEnabled,
	isRequestMockModeEnabled,
} from '#/mock-mode/runtime'

import {
	getOnProfileIncomplete,
	getOnUnauthorized,
	getServerUnauthorizedRetryHeaders,
} from './client-handlers'
import { serializeSearchParams } from './search-params'

export { setOnProfileIncomplete, setOnUnauthorized } from './client-handlers'

/** Subset of FetchRequestConfig */
export interface RequestConfig<TData = unknown> {
	baseURL?: string
	credentials?: RequestCredentials
	data?: FormData | TData
	headers?: [string, string][] | Record<string, string>
	method?: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'
	// Record<string, unknown> breaks assignability of Kubb-generated typed query param objects
	// (no index signature); see the identical constraint in packages/api/database/client.ts.
	// eslint-disable-next-line typescript/no-restricted-types
	params?: object
	signal?: AbortSignal
	url?: string
}

/** Subset of FetchResponse */
export interface ResponseConfig<TData = unknown> {
	data: TData
	headers: Headers
	status: number
	statusText: string
}

let _config: Partial<RequestConfig> = {}

export const getConfig = () => _config

export function setConfig(config: Partial<RequestConfig>) {
	_config = config
	return getConfig()
}

function headersToRecord(headers: RequestConfig['headers']): Record<string, string> {
	return Array.isArray(headers) ? Object.fromEntries(headers) : (headers ?? {})
}

export function mergeConfig<T extends RequestConfig>(...configs: Partial<T>[]): Partial<T> {
	const merged: Partial<T> = {}

	for (const config of configs) {
		const headers = { ...headersToRecord(merged.headers), ...headersToRecord(config.headers) }
		Object.assign(merged, config, { headers })
	}

	return merged
}

export type ResponseErrorConfig<TError = unknown> = TError

export type Client = <TData, _TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>

export function isAuthPath(url: string | undefined) {
	return url != null && (url === '/api/me' || url.startsWith('/api/auth/'))
}

export function isSameOriginPath(url: string | undefined) {
	return (
		url != null && (url === '/api/skills' || url.startsWith('/api/skills/') || isAuthPath(url))
	)
}

export function getBaseUrl(url: string | undefined) {
	// Skills are served by this app's own Route Handlers (backed by Supabase) —
	// no external backend exists for them, so requests stay same-origin.
	if (isSameOriginPath(url)) {
		return ''
	}

	if (globalThis.window === undefined) {
		return serverEnvironment.BACK_INTERNAL_URL
	}

	if (isDev) {
		return clientEnvironment.NEXT_PUBLIC_BFF_PATH
	}

	return clientEnvironment.NEXT_PUBLIC_BACK_URL
}

function isEnvFlagEnabled(value: boolean | string | undefined) {
	// В CI skipValidation возвращает raw env-строки без zod transform.
	return value === true || value === 'true'
}

async function isMockModeEnabled(config: Partial<RequestConfig>) {
	if (globalThis.window === undefined) {
		if (
			isEnvFlagEnabled(process.env.MOCK_MODE) ||
			isEnvFlagEnabled(serverEnvironment.MOCK_MODE) ||
			isRequestMockModeEnabled(config.headers)
		) {
			return true
		}

		if (process.env.NEXT_RUNTIME !== 'nodejs' && process.env.NEXT_RUNTIME !== 'edge') {
			return false
		}

		try {
			const { headers } = await import('next/headers')
			return isRequestMockModeEnabled(await headers())
		} catch {
			return false
		}
	}

	return (
		isEnvFlagEnabled(process.env.NEXT_PUBLIC_MOCK_MODE ?? process.env.MOCK_MODE) ||
		isEnvFlagEnabled(clientEnvironment.NEXT_PUBLIC_MOCK_MODE) ||
		isRequestMockModeEnabled(config.headers) ||
		isBrowserRuntimeMockModeEnabled()
	)
}

async function getRawMockScenario(config: Partial<RequestConfig>) {
	const rawFromConfig = getRequestMockScenario(config.headers)

	if (rawFromConfig != null) {
		return rawFromConfig
	}

	if (globalThis.window === undefined) {
		if (process.env.NEXT_RUNTIME !== 'nodejs' && process.env.NEXT_RUNTIME !== 'edge') {
			return
		}

		try {
			const { headers } = await import('next/headers')
			return getRequestMockScenario(await headers())
		} catch {
			return
		}
	}

	return getBrowserMockScenario()
}

async function getMockScenario(config: Partial<RequestConfig>) {
	const raw = await getRawMockScenario(config)

	if (raw == null) {
		return
	}

	const { isBaseMockScenarioName } = await import('./mock-scenarios')

	if (!isBaseMockScenarioName(raw)) {
		return
	}

	return raw
}

async function getResponseJson<TData>(response: Response) {
	try {
		return (await response.json()) as TData
	} catch {
		return undefined
	}
}

async function getAuthHeaders(): Promise<Record<string, string>> {
	const resolvedHeaders: Record<string, string> = {}

	if (globalThis.window !== undefined) {
		return resolvedHeaders
	}

	const basicAuth = serverEnvironment.BACK_INTERNAL_BASIC_AUTH

	if (basicAuth != null) {
		resolvedHeaders.Authorization = `Basic ${basicAuth}`
	}

	const { headers } = await import('next/headers')
	const requestHeaders = await headers()
	const cookiesHeader = requestHeaders.get('Cookie')

	if (cookiesHeader != null) {
		resolvedHeaders.Cookie = cookiesHeader
	}

	return resolvedHeaders
}

function isNoContentStatus(status: number) {
	return [204, 205, 304].includes(status)
}

async function parseResponseData<TData>(response: Response): Promise<TData> {
	if (isNoContentStatus(response.status) || !response.body) {
		const empty: Record<string, never> = {}
		return empty as TData
	}

	return (await response.json()) as TData
}

function toResponseConfig<TData>(response: Response, data: TData): ResponseConfig<TData> {
	return {
		data,
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	}
}

async function buildFetchResponse<TData>(response: Response): Promise<ResponseConfig<TData>> {
	const data = await parseResponseData<TData>(response)
	return toResponseConfig(response, data)
}

async function throwFetchError<TError>(response: Response): Promise<never> {
	const errorData = await getResponseJson<TError>(response)

	throw new Error(response.statusText, {
		cause: {
			data: errorData,
			status: response.status,
			statusText: response.statusText,
		},
	})
}

function buildRetryRequestInit(
	config: Partial<RequestConfig>,
	isFormData: boolean,
	headers: HeadersInit,
): RequestInit {
	return {
		credentials: config.credentials ?? 'include',
		method: config.method?.toUpperCase(),
		body: isFormData ? (config.data as FormData) : JSON.stringify(config.data),
		signal: config.signal,
		headers,
	}
}

async function retryAfterUnauthorized<TData, TError>(
	unauthorizedResponse: Response,
	targetUrl: string,
	config: Partial<RequestConfig>,
	requestHeaders: Headers,
	isFormData: boolean,
): Promise<ResponseConfig<TData>> {
	const onUnauthorized = getOnUnauthorized()
	const retryHeaders = onUnauthorized
		? requestHeaders
		: await getServerUnauthorizedRetryHeaders(requestHeaders)

	if (onUnauthorized) {
		await onUnauthorized()
	}

	if (retryHeaders === null) {
		return throwFetchError<TError>(unauthorizedResponse)
	}

	const retryResponse = await globalThis.fetch(
		targetUrl,
		buildRetryRequestInit(config, isFormData, retryHeaders),
	)

	if (!retryResponse.ok && retryResponse.status !== 304) {
		return throwFetchError<TError>(retryResponse)
	}

	return buildFetchResponse<TData>(retryResponse)
}

function buildTargetUrl(config: Partial<RequestConfig>): string {
	const baseURL = getBaseUrl(config.url)
	let targetUrl = [baseURL, config.url].filter(Boolean).join('')

	if (config.params) {
		const serializedSearchParams = serializeSearchParams(config.params)

		if (serializedSearchParams !== '') {
			targetUrl += `?${serializedSearchParams}`
		}
	}

	return targetUrl
}

async function buildRequestHeaders(
	config: Partial<RequestConfig>,
	isFormData: boolean,
): Promise<Headers> {
	const authHeaders = await getAuthHeaders()

	return new Headers({
		...authHeaders,
		...headersToRecord(config.headers),
		...(!isFormData && { 'Content-Type': 'application/json' }),
	})
}

async function fetch<TData, TError = unknown, TVariables = unknown>(
	paramsConfig: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> {
	const config = mergeConfig(getConfig(), paramsConfig)

	const isMockMode = !isAuthPath(config.url) && (await isMockModeEnabled(config))

	if (isMockMode) {
		const { getMockResponse } = await import('./mock-client')
		const scenario = await getMockScenario(config)
		return getMockResponse<TData>(config, scenario)
	}

	const targetUrl = buildTargetUrl(config)
	const isFormData = config.data instanceof FormData
	const requestHeaders = await buildRequestHeaders(config, isFormData)
	const method = config.method ?? 'GET'

	const response = await globalThis.fetch(targetUrl, {
		credentials: config.credentials ?? 'include',
		method,
		body: isFormData ? (config.data as FormData) : JSON.stringify(config.data),
		signal: config.signal,
		headers: requestHeaders,
	})

	if (response.status === 401 && !isAuthPath(config.url)) {
		return retryAfterUnauthorized<TData, TError>(
			response,
			targetUrl,
			config,
			requestHeaders,
			isFormData,
		)
	}

	if (!response.ok && response.status !== 304) {
		const errorData = await getResponseJson<{ error?: string }>(response)

		if (response.status === 403 && errorData?.error === 'profile_incomplete') {
			getOnProfileIncomplete()?.()
		}

		throw new Error(response.statusText, {
			cause: {
				data: errorData,
				status: response.status,
				statusText: response.statusText,
			},
		})
	}

	return buildFetchResponse<TData>(response)
}

fetch.getConfig = getConfig
fetch.setConfig = setConfig

export default fetch
