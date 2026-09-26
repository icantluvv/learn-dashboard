export const DIFFICULTY_OPTIONS = [
	{ id: 'easy', label: 'Лёгкий' },
	{ id: 'medium', label: 'Средний' },
	{ id: 'hard', label: 'Сложный' },
] as const

export const DIFFICULTY_LABELS: Record<(typeof DIFFICULTY_OPTIONS)[number]['id'], string> = {
	easy: 'Лёгкий',
	medium: 'Средний',
	hard: 'Сложный',
}
