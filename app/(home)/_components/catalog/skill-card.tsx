import type { GetSkills200 } from '@repo/api'

import { Card } from '@heroui/react'
import Link from 'next/link'

import { DIFFICULTY_LABELS } from '../../_constants/difficulty-options'

interface SkillCardProps {
	skill: GetSkills200[number]
}

export function SkillCard({ skill }: SkillCardProps) {
	return (
		<Link href={`/catalog/${skill.id}`} className="flex">
			<Card className={`
       size-full rounded-xl transition-transform border-shaded
       hover:scale-[1.02]
   `}>
				<div className="flex items-center justify-between gap-4">
					<span className="text-xs font-medium text-gray-500">{skill.topic}</span>
					<span className="text-xs font-medium text-gray-500">
						{DIFFICULTY_LABELS[skill.difficulty]}
					</span>
				</div>

				<div className="v-stack gap-1">
					<h3 className="text-2xl font-semibold">{skill.title}</h3>
					<span className="text-sm text-gray-500">{skill.questionsCount} вопросов</span>
				</div>
			</Card>
		</Link>
	)
}
