import type { GetCores200 } from '@repo/api'

/**
 * Направление навыка. Тип выводится из контракта, поэтому добавление значения в OpenAPI сразу
 * ломает сборку в местах, где реестр ниже не был расширен.
 */
export type SkillCore = GetCores200[number]['type']

/** Допустимые значения сегмента URL; порядок витрины приходит из `public.cores`. */
export const SKILL_CORES = [
	'frontend',
	'backend',
	'devops',
	'design',
] as const satisfies readonly SkillCore[]

const CORE_BY_SEGMENT = new Map<string, SkillCore>(SKILL_CORES.map((core) => [core, core]))

/** Возвращает направление по сегменту URL или `null`, если такого направления нет. */
export function resolveSkillCore(segment: string): SkillCore | null {
	return CORE_BY_SEGMENT.get(segment) ?? null
}
