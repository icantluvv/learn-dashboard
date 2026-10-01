import type { GetSkillById200 } from '@repo/api'

import { CopyQuestionButton } from './copy-question-button'
import { SkillCompletionButton } from './skill-completion-button'

interface SkillDetailContentProps {
	isAuthenticated: boolean
	skill: GetSkillById200
	skillId: string
}

export function SkillDetailContent({ isAuthenticated, skill, skillId }: SkillDetailContentProps) {
	return (
		<div className="v-stack gap-4">
			<section className={`
				flex flex-col items-start gap-4 rounded-2xl bg-card p-6 text-card-foreground
				sm:flex-row sm:items-center sm:justify-between
			`}>
				<h1 className="min-w-0 text-3xl font-semibold wrap-break-word">{skill.title}</h1>

				<SkillCompletionButton isAuthenticated={isAuthenticated} skillId={skillId} />
			</section>

			<section className="rounded-2xl bg-card p-6 text-card-foreground">
				{skill.questions.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						У этого навыка пока нет вопросов.
					</p>
				) : (
					<ol className="v-stack list-none gap-7">
						{skill.questions.map((question, index) => (
							<li key={question} className="flex items-start gap-2">
								<span className="font-semibold">{index + 1}.</span>
								<span className="min-w-0 flex-1">{question}</span>
								<CopyQuestionButton question={question} />
							</li>
						))}
					</ol>
				)}
			</section>
		</div>
	)
}
