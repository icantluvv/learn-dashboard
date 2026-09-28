import type { SkillCore } from '#/constants/skill-cores'

export interface CoreSeoCopy {
	description: string
	/** Заголовок страницы направления без имени бренда: его добавляет шаблон корневого layout. */
	title: string
}

/**
 * SEO-строки направлений.
 *
 * Тип `Record<SkillCore, …>` намеренно исчерпывающий: направление, добавленное в OpenAPI-контракт,
 * ломает сборку, пока для него не заведены заголовок и описание.
 *
 * Строки статические, а не из БД: метаданные не должны зависеть от доступности источника данных, а
 * самый частый маршрут каталога не должен делать лишний запрос ради `<title>`.
 */
export const CORE_SEO_COPY: Record<SkillCore, CoreSeoCopy> = {
	frontend: {
		title: 'Frontend — подготовка к собеседованию',
		description:
			'Навыки, темы и вопросы для подготовки к собеседованию по frontend-разработке: ' +
			'вёрстка, JavaScript, TypeScript, React и инструменты сборки.',
	},
	backend: {
		title: 'Backend — подготовка к собеседованию',
		description:
			'Навыки, темы и вопросы для подготовки к собеседованию по backend-разработке: ' +
			'языки и фреймворки, базы данных, API и архитектура сервисов.',
	},
	devops: {
		title: 'DevOps — подготовка к собеседованию',
		description:
			'Навыки, темы и вопросы для подготовки к собеседованию по DevOps: контейнеризация, ' +
			'CI/CD, инфраструктура, мониторинг и надёжность.',
	},
	design: {
		title: 'Design — подготовка к собеседованию',
		description:
			'Навыки, темы и вопросы для подготовки к собеседованию по продуктовому и ' +
			'интерфейсному дизайну: исследования, UX, визуальный язык и дизайн-системы.',
	},
}

export function getCoreSeoCopy(core: SkillCore): CoreSeoCopy {
	return CORE_SEO_COPY[core]
}
