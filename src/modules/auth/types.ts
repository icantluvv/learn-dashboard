export interface AuthActionResult {
	fieldErrors?: Record<string, string>
	formError?: string
	ok: boolean
}

export type AuthAction = (values: unknown) => Promise<AuthActionResult>
