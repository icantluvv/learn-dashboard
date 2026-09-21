import type { RequestConfig } from './client'
import type { GetSkillsQueryParams, GetSkillsQueryResponse } from './codegen'
import type { MockRoute, RequestMethod } from './mock-client'

export type BaseMockScenarioName = 'default'

export const activeBaseMockScenario: BaseMockScenarioName = 'default'
export const notificationsMockScenario: BaseMockScenarioName = 'default'

const skillCards: GetSkillsQueryResponse = [
	{
		id: 'skill-01',
		title: 'Авторизация и аутентификация',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Безопасность',
	},
	{
		id: 'skill-02',
		title: 'Алгоритмы и структуры данных',
		questionsCount: 21,
		difficulty: 'hard',
		topic: 'Алгоритмы и структуры данных',
	},
	{
		id: 'skill-03',
		title: 'Асинхронность',
		questionsCount: 16,
		difficulty: 'medium',
		topic: 'JavaScript',
	},
	{
		id: 'skill-04',
		title: 'Безопасность',
		questionsCount: 23,
		difficulty: 'hard',
		topic: 'Безопасность',
	},
	{
		id: 'skill-05',
		title: 'Веб-компоненты',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-06',
		title: 'Дата и время',
		questionsCount: 8,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-07',
		title: 'Иммутабельность и мутации',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'JavaScript',
	},
	{
		id: 'skill-08',
		title: 'Итераторы и генераторы',
		questionsCount: 16,
		difficulty: 'medium',
		topic: 'JavaScript',
	},
	{
		id: 'skill-09',
		title: 'Как браузер рисует страницы',
		questionsCount: 23,
		difficulty: 'hard',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-10',
		title: 'Ключевые принципы разработки ПО',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-11',
		title: 'Мемоизация',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Алгоритмы и структуры данных',
	},
	{
		id: 'skill-12',
		title: 'Методы массивов JS',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-13',
		title: 'Микрофронтенды',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-14',
		title: 'Модульность',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-15',
		title: 'Объекты и их методы',
		questionsCount: 12,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-16',
		title: 'ООП',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-17',
		title: 'Основные стратегии',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-18',
		title: 'Переменные и типы данных',
		questionsCount: 10,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-19',
		title: 'Поведенческие паттерны',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-20',
		title: 'Порождающие паттерны',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-21',
		title: 'Работа с числами',
		questionsCount: 8,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-22',
		title: 'Работа со строками',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-23',
		title: 'Регулярные выражения',
		questionsCount: 16,
		difficulty: 'medium',
		topic: 'JavaScript',
	},
	{
		id: 'skill-24',
		title: 'События JS',
		questionsCount: 11,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-25',
		title: 'Структурные паттерны',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-26',
		title: 'Теория тестирования',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Тестирование',
	},
	{
		id: 'skill-27',
		title: 'Функции',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-28',
		title: 'Чистая архитектура',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-29',
		title: 'Atomic Design',
		questionsCount: 11,
		difficulty: 'easy',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-30',
		title: 'Canvas',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-31',
		title: 'CI - CD',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-32',
		title: 'Code-splitting & Tree-shaking',
		questionsCount: 21,
		difficulty: 'hard',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-33',
		title: 'CORS',
		questionsCount: 16,
		difficulty: 'medium',
		topic: 'Сеть и протоколы',
	},
	{
		id: 'skill-34',
		title: 'Docker',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-35',
		title: 'docker-compose',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-36',
		title: 'Error handling',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'JavaScript',
	},
	{
		id: 'skill-37',
		title: 'ES6',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'JavaScript',
	},
	{
		id: 'skill-38',
		title: 'ES6-ESNext',
		questionsCount: 16,
		difficulty: 'medium',
		topic: 'JavaScript',
	},
	{
		id: 'skill-39',
		title: 'ESLint и Prettier',
		questionsCount: 11,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-40',
		title: 'Event Loop',
		questionsCount: 24,
		difficulty: 'hard',
		topic: 'JavaScript',
	},
	{
		id: 'skill-41',
		title: 'HTTP запросы JS',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Сеть и протоколы',
	},
	{
		id: 'skill-42',
		title: 'HTTP протокол',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'Сеть и протоколы',
	},
	{
		id: 'skill-43',
		title: 'Hydration Resumability',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-44',
		title: 'i18n',
		questionsCount: 11,
		difficulty: 'easy',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-45',
		title: 'IFrame',
		questionsCount: 12,
		difficulty: 'easy',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-46',
		title: 'IndexedDB',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-47',
		title: 'Islands Architecture',
		questionsCount: 21,
		difficulty: 'hard',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-48',
		title: 'Lottie',
		questionsCount: 10,
		difficulty: 'easy',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-49',
		title: 'MobX базовый',
		questionsCount: 11,
		difficulty: 'easy',
		topic: 'State Management',
	},
	{
		id: 'skill-50',
		title: 'MobX advanced',
		questionsCount: 24,
		difficulty: 'hard',
		topic: 'State Management',
	},
	{
		id: 'skill-51',
		title: 'MV* паттерны',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-52',
		title: 'Next.js',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'Next.js',
	},
	{
		id: 'skill-53',
		title: 'NextJS advanced',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'Next.js',
	},
	{
		id: 'skill-54',
		title: 'NPM',
		questionsCount: 11,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-55',
		title: 'NPM advanced',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-56',
		title: 'Playwright',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'Тестирование',
	},
	{
		id: 'skill-57',
		title: 'PRPL паттерн',
		questionsCount: 21,
		difficulty: 'hard',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-58',
		title: 'PWA',
		questionsCount: 16,
		difficulty: 'medium',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-59',
		title: 'RAIL model',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-60',
		title: 'RBAC CASL abilities',
		questionsCount: 24,
		difficulty: 'hard',
		topic: 'Безопасность',
	},
	{
		id: 'skill-61',
		title: 'React Классовые компоненты и HOC',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'React',
	},
	{
		id: 'skill-62',
		title: 'React Основы',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'React',
	},
	{
		id: 'skill-63',
		title: 'React производительность',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'React',
	},
	{
		id: 'skill-64',
		title: 'React Advanced',
		questionsCount: 23,
		difficulty: 'hard',
		topic: 'React',
	},
	{
		id: 'skill-65',
		title: 'React Compound',
		questionsCount: 24,
		difficulty: 'hard',
		topic: 'React',
	},
	{
		id: 'skill-66',
		title: 'React forms',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'React',
	},
	{
		id: 'skill-67',
		title: 'React Hooks',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'React',
	},
	{
		id: 'skill-68',
		title: 'React Hooks Advanced',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'React',
	},
	{
		id: 'skill-69',
		title: 'React Routing',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'React',
	},
	{
		id: 'skill-70',
		title: 'React Testing Library',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Тестирование',
	},
	{
		id: 'skill-71',
		title: 'React TypeScript',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'React',
	},
	{
		id: 'skill-72',
		title: 'S.O.L.I.D.',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'Архитектура и паттерны',
	},
	{
		id: 'skill-73',
		title: 'SEO',
		questionsCount: 10,
		difficulty: 'easy',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-74',
		title: 'Service workers',
		questionsCount: 23,
		difficulty: 'hard',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-75',
		title: 'Shared Workers',
		questionsCount: 24,
		difficulty: 'hard',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-76',
		title: 'SSH',
		questionsCount: 8,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-77',
		title: 'Storybook',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-78',
		title: 'TailwindCSS',
		questionsCount: 10,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-79',
		title: 'TanStack Query',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'State Management',
	},
	{
		id: 'skill-80',
		title: 'TypeScript - LVL 1',
		questionsCount: 12,
		difficulty: 'easy',
		topic: 'TypeScript',
	},
	{
		id: 'skill-81',
		title: 'TypeScript - LVL 2',
		questionsCount: 20,
		difficulty: 'hard',
		topic: 'TypeScript',
	},
	{
		id: 'skill-82',
		title: 'Vite',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-83',
		title: 'Vitest',
		questionsCount: 10,
		difficulty: 'easy',
		topic: 'Тестирование',
	},
	{
		id: 'skill-84',
		title: 'Vue 2 vs Vue 3',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'Vue',
	},
	{
		id: 'skill-85',
		title: 'Vue Анимации',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Vue',
	},
	{
		id: 'skill-86',
		title: 'Vue Основы',
		questionsCount: 8,
		difficulty: 'easy',
		topic: 'Vue',
	},
	{
		id: 'skill-87',
		title: 'Vue Паттерны',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'Vue',
	},
	{
		id: 'skill-88',
		title: 'Vue Производительность',
		questionsCount: 22,
		difficulty: 'hard',
		topic: 'Vue',
	},
	{
		id: 'skill-89',
		title: 'Vue Advanced',
		questionsCount: 23,
		difficulty: 'hard',
		topic: 'Vue',
	},
	{
		id: 'skill-90',
		title: 'Vue Router',
		questionsCount: 18,
		difficulty: 'medium',
		topic: 'Vue',
	},
	{
		id: 'skill-91',
		title: 'Vue Stores',
		questionsCount: 14,
		difficulty: 'medium',
		topic: 'State Management',
	},
	{
		id: 'skill-92',
		title: 'Vue TypeScript',
		questionsCount: 15,
		difficulty: 'medium',
		topic: 'Vue',
	},
	{
		id: 'skill-93',
		title: 'Vue UI components',
		questionsCount: 10,
		difficulty: 'easy',
		topic: 'Vue',
	},
	{
		id: 'skill-94',
		title: 'Web workers',
		questionsCount: 17,
		difficulty: 'medium',
		topic: 'Браузер и веб-платформа',
	},
	{
		id: 'skill-95',
		title: 'Webpack',
		questionsCount: 24,
		difficulty: 'hard',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-96',
		title: 'YAML',
		questionsCount: 8,
		difficulty: 'easy',
		topic: 'Инструменты и сборка',
	},
	{
		id: 'skill-97',
		title: 'Zod',
		questionsCount: 9,
		difficulty: 'easy',
		topic: 'TypeScript',
	},
]

function filterSkillCards(params: GetSkillsQueryParams | undefined): GetSkillsQueryResponse {
	if (!params) {
		return skillCards
	}

	const search = params.search?.trim().toLowerCase()

	return skillCards.filter((skill) => {
		if (search != null && search !== '' && !skill.title.toLowerCase().includes(search)) {
			return false
		}

		if (params.topic != null && params.topic !== '' && skill.topic !== params.topic) {
			return false
		}

		if (params.difficulty != null && skill.difficulty !== params.difficulty) {
			return false
		}

		if (params.minQuestionsCount != null && skill.questionsCount < params.minQuestionsCount) {
			return false
		}

		if (params.maxQuestionsCount != null && skill.questionsCount > params.maxQuestionsCount) {
			return false
		}

		return true
	})
}

// Example scenario — add routes here to intercept API calls in mock mode.
// Each route matches a method + URL pattern and returns stubbed data via `create`.
const mockScenarios = {
	default: [
		{
			method: 'GET',
			pattern: /^\/api\/skills$/,
			create: (config?: Partial<RequestConfig>) => filterSkillCards(config?.params),
		},
	],
} satisfies Record<BaseMockScenarioName, MockRoute[]>

const alwaysActiveMockRoutes: MockRoute[] = []

export function isBaseMockScenarioName(
	value: string | null | undefined,
): value is BaseMockScenarioName {
	return value != null && new Set(Object.keys(mockScenarios)).has(value)
}

export function getMockScenarioRoute(
	method: RequestMethod,
	path: string,
	scenario: BaseMockScenarioName = activeBaseMockScenario,
): MockRoute | undefined {
	return [
		...mockScenarios[scenario],
		...mockScenarios[notificationsMockScenario],
		...alwaysActiveMockRoutes,
	].find((route) => route.method === method && route.pattern.test(path))
}
