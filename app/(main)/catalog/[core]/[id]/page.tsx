import type { Metadata } from 'next'

import { getSkillByIdQueryOptions } from '@repo/api'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'

import { BackButton } from '#/components/back-button'
import { resolveSkillCore } from '#/constants/skill-cores'
import { getCurrentUser } from '#/lib/auth/get-session'
import { isSkillCompleted } from '#/modules/skills/server/skill-completion-repository.server'
import { getSkillById } from '#/modules/skills/server/skills-repository'
import { buildPageMetadata, getCoreSeoCopy } from '#/seo'
import { getQueryClient } from '#/utils/get-query-client'
import {
	SkillDetailContent,
	SkillDetailError,
} from '@/(main)/catalog/[core]/[id]/_components/skill-detail'

import { isSkillInCore } from './skill-route'

interface CatalogSkillPageProps {
	params: Promise<{ core: string; id: string }>
}

function buildSkillDescription(title: string, questionsCount: number): string {
	return questionsCount > 0
		? `Навык «${title}»: ${questionsCount} вопросов для самопроверки перед собеседованием.`
		: `Навык «${title}»: темы и материалы для подготовки к собеседованию.`
}

export async function generateMetadata({ params }: CatalogSkillPageProps): Promise<Metadata> {
	const { core: coreSegment, id } = await params
	const core = resolveSkillCore(coreSegment)

	if (core == null) {
		notFound()
	}

	const corePath = `/catalog/${core}` as const
	const coreCopy = getCoreSeoCopy(core)

	let skill: Awaited<ReturnType<typeof getSkillById>>

	try {
		skill = await getSkillById(id)
	} catch {
		return buildPageMetadata({
			title: coreCopy.title,
			description: coreCopy.description,
			path: corePath,
			noIndex: true,
		})
	}

	if (skill == null || !isSkillInCore(skill.core, core)) {
		notFound()
	}

	return buildPageMetadata({
		title: skill.title,
		description: buildSkillDescription(skill.title, skill.questions.length),
		path: `${corePath}/${id}`,
	})
}

export default async function CatalogSkillPage({ params }: CatalogSkillPageProps) {
	const { core: coreSegment, id } = await params
	const core = resolveSkillCore(coreSegment)

	if (core == null) {
		notFound()
	}

	const queryClient = getQueryClient()

	let skill: Awaited<ReturnType<typeof getSkillById>>

	try {
		skill = await getSkillById(id)
	} catch {
		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<div className={`
					page-wrapper v-stack gap-12
					md:flex-row
				`}>
					<SkillDetailError />
				</div>
			</HydrationBoundary>
		)
	}

	if (skill == null || !isSkillInCore(skill.core, core)) {
		notFound()
	}

	const user = await getCurrentUser()

	queryClient.setQueryData(
		getSkillByIdQueryOptions({ id }).queryKey,
		user == null ? skill : { ...skill, completed: await isSkillCompleted(user.id, id) },
	)

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className={`
				page-wrapper v-stack gap-12
				md:flex-row
			`}>
				<div className="v-stack min-w-0 flex-1 gap-4">
					<BackButton />
					<SkillDetailContent skill={skill} skillId={id} isAuthenticated={user != null} />
				</div>
			</div>
		</HydrationBoundary>
	)
}
