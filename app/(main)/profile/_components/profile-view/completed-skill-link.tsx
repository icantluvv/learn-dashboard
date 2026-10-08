import type {
	CompletedSkillsCoreGroup,
	CompletedSkillSummaryItem,
} from '#/modules/skills/server/skill-completion-repository.server'

import Link from 'next/link'

interface CompletedSkillLinkProps {
	core: CompletedSkillsCoreGroup['core']
	skill: CompletedSkillSummaryItem
}

export function CompletedSkillLink({ core, skill }: CompletedSkillLinkProps) {
	return (
		<Link href={`/catalog/${core}/${skill.id}`} className={`
			inline-flex rounded-full px-3 py-1 text-sm transition-colors duration-150 border-shaded
			hover:bg-brand-primary/10
			focus-visible:outline-2 focus-visible:outline-offset-2
			focus-visible:outline-brand-primary
			active:bg-brand-primary/20
			motion-reduce:transition-none
		`}>
			{skill.title}
		</Link>
	)
}
