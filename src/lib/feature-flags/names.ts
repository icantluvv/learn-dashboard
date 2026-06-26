export const FEATURE_FLAGS = {
	example: 'example',
} as const

export type FeatureFlagName = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS]
