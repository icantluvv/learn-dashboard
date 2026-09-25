import { serverEnvironment } from '#/env/server'

import { serializeSearchParams } from '../base/search-params'

import 'server-only'

/** Subset of FetchRequestConfig */
export interface RequestConfig<TData = unknown> {
	baseURL?: string
	data?: TData
	headers?: [string, string][] | Record<string, string>
	method?: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'
	// Record<string, unknown> breaks assignability of Kubb-generated typed query param objects
	// (no index signature); see the identical constraint in packages/api/base/client.ts.
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

export type ResponseErrorConfig<TError = unknown> = TError

export type Client = <TData, _TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>

async function getResponseJson<TData>(response: Response) {
	try {
		return (await response.json()) as TData
	} catch {
		return undefined
	}
}

/**
 * Server-only transport that talks to Supabase's PostgREST endpoint (`{SUPABASE_URL}/rest/v1`)
 * using the service role key. Never import this module from a Client Component - it must not reach
 * the browser bundle.
 */
async function fetchDatabase<TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> {
	const baseURL = `${serverEnvironment.SUPABASE_URL}/rest/v1`
	let targetUrl = `${baseURL}${config.url ?? ''}`

	if (config.params) {
		const serializedSearchParams = serializeSearchParams(config.params)

		if (serializedSearchParams !== '') {
			targetUrl += `?${serializedSearchParams}`
		}
	}

	const requestHeaders = new Headers({
		apikey: serverEnvironment.SUPABASE_SERVICE_ROLE_KEY,
		Authorization: `Bearer ${serverEnvironment.SUPABASE_SERVICE_ROLE_KEY}`,
		...(Array.isArray(config.headers) ? Object.fromEntries(config.headers) : config.headers),
	})

	const response = await globalThis.fetch(targetUrl, {
		method: config.method ?? 'GET',
		signal: config.signal,
		headers: requestHeaders,
	})

	if (!response.ok) {
		const errorData = await getResponseJson<TError>(response)

		throw new Error(response.statusText, {
			cause: {
				data: errorData,
				status: response.status,
				statusText: response.statusText,
			},
		})
	}

	const data = response.status === 204 || !response.body ? [] : await response.json()

	return {
		data: data as TData,
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	}
}

export default fetchDatabase
