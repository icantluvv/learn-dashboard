export const GENDER_VALUES = ['male', 'female', 'other'] as const

export type Gender = (typeof GENDER_VALUES)[number]

export const MIN_NAME_LENGTH = 3
export const MIN_PASSWORD_LENGTH = 8
export const MIN_AGE = 1
export const MAX_AGE = 120
