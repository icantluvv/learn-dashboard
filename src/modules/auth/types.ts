export interface AuthActionResult {
	fieldErrors?: Record<string, string>
	formError?: string
	ok: boolean
}

export type AuthAction = (values: unknown) => Promise<AuthActionResult>
export type SignUpAction = (values: FormData) => Promise<AuthActionResult>

export type UpdateAvatarActionResult = { error: string; ok: false } | { image: string; ok: true }
export type UpdateAvatarAction = (formData: FormData) => Promise<UpdateAvatarActionResult>
