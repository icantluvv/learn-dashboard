import type { GetSkillById200 } from '@repo/api'

interface SkillDetailContentProps {
	skill: GetSkillById200
}

export function SkillDetailContent({ skill }: SkillDetailContentProps) {
	return (
		<div className="v-stack gap-4">
			<section className="rounded-2xl bg-white p-6">
				<h1 className="text-3xl font-semibold">{skill.title}</h1>
			</section>

			<section className="rounded-2xl bg-white p-6">
				{skill.questions.length === 0 ? (
					<p className="text-sm text-gray-600">У этого навыка пока нет вопросов.</p>
				) : (
					<ol className="v-stack list-none gap-2">
						{skill.questions.map((question, index) => (
							<li key={question} className="flex gap-2">
								<span className="font-semibold text-gray-500">{index + 1}.</span>
								<span>{question}</span>
							</li>
						))}
					</ol>
				)}
			</section>
		</div>
	)
}
