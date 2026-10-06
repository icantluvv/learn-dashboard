function appendSearchParam(searchParams: URLSearchParams, key: string, value: unknown) {
	if (value === undefined) {
		return
	}

	if (Array.isArray(value)) {
		for (const item of value) {
			appendSearchParam(searchParams, key, item)
		}

		return
	}

	searchParams.append(key, value === null ? 'null' : String(value))
}

// Kubb-generated query parameter types do not declare an index signature.
// eslint-disable-next-line typescript/no-restricted-types
export function serializeSearchParams(params: object) {
	const searchParams = new URLSearchParams()

	for (const [key, value] of Object.entries(params)) {
		appendSearchParam(searchParams, key, value)
	}

	return searchParams.toString()
}
