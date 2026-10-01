import type { SkillCore } from '#/constants/skill-cores'

export function isSkillInCore(skillCore: SkillCore, routeCore: SkillCore | null) {
	return routeCore != null && skillCore === routeCore
}
