import type { SelectFieldOption } from '@repo/core/form'

import { ROLE_VALUES } from '#/lib/auth/constants'

export const ROLE_OPTIONS: readonly SelectFieldOption[] = [
	{ label: 'Разработчик', value: ROLE_VALUES[0] },
	{ label: 'Аналитик', value: ROLE_VALUES[1] },
	{ label: 'Студент', value: ROLE_VALUES[2] },
	{ label: 'Начинающий', value: ROLE_VALUES[3] },
]
