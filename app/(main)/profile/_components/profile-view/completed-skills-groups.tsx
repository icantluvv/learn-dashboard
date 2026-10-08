import type { CompletedSkillsCoreGroup } from '#/modules/skills/server/skill-completion-repository.server'

import { CompletedSkillLink } from './completed-skill-link'

interface CompletedSkillsGroupsProps {
	groups?: CompletedSkillsCoreGroup[]
}

export function CompletedSkillsGroups({ groups }: CompletedSkillsGroupsProps) {
	if (groups == null || groups.length === 0) {
		return null
	}

	return (
		<div className="v-stack gap-4">
			{groups.map((group) => (
				<div key={group.core} className="v-stack gap-2">
					<span className="text-sm font-medium text-muted-foreground">
						{group.coreName}
					</span>
					<div className="flex flex-wrap gap-2">
						{group.skills.map((skill) => (
							<CompletedSkillLink key={skill.id} core={group.core} skill={skill} />
						))}
					</div>
				</div>
			))}
		</div>
	)
}
