import type { SkillCore } from '#/constants/skill-cores'

/** Проверяет, что навык открыт внутри собственного направления каталога. */
export function isSkillInCore(skillCore: SkillCore, routeCore: SkillCore | null) {
	return routeCore != null && skillCore === routeCore
}
