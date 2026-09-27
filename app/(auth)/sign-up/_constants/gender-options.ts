import type { SelectFieldOption } from '@repo/core/form'

import { SIGN_UP_GENDER_VALUES } from '#/lib/auth/constants'

export const GENDER_OPTIONS: readonly SelectFieldOption[] = [
	{ label: 'Мужской', value: SIGN_UP_GENDER_VALUES[0] },
	{ label: 'Женский', value: SIGN_UP_GENDER_VALUES[1] },
]
