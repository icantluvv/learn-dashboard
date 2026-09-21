export type { GetExampleQueryKey } from './hooks/exampleController/useGetExample'
export type { GetExampleSuspenseQueryKey } from './hooks/exampleController/useGetExampleSuspense'
export type { GetSkillsQueryKey } from './hooks/skillsController/useGetSkills'
export type { GetSkillsSuspenseQueryKey } from './hooks/skillsController/useGetSkillsSuspense'
export type { Skill } from './types/Skill'
export type {
	GetExample200,
	GetExample404,
	GetExampleQuery,
	GetExampleQueryResponse,
} from './types/exampleController/GetExample'
export type {
	GetSkills200,
	GetSkillsQuery,
	GetSkillsQueryParams,
	GetSkillsQueryResponse,
} from './types/skillsController/GetSkills'
export { getExample } from './clients/exampleController/getExample'
export { getSkills } from './clients/skillsController/getSkills'
export { getExampleQueryKey } from './hooks/exampleController/useGetExample'
export { getExampleQueryOptions } from './hooks/exampleController/useGetExample'
export { useGetExample } from './hooks/exampleController/useGetExample'
export { getExampleSuspenseQueryKey } from './hooks/exampleController/useGetExampleSuspense'
export { getExampleSuspenseQueryOptions } from './hooks/exampleController/useGetExampleSuspense'
export { useGetExampleSuspense } from './hooks/exampleController/useGetExampleSuspense'
export { getSkillsQueryKey } from './hooks/skillsController/useGetSkills'
export { getSkillsQueryOptions } from './hooks/skillsController/useGetSkills'
export { useGetSkills } from './hooks/skillsController/useGetSkills'
export { getSkillsSuspenseQueryKey } from './hooks/skillsController/useGetSkillsSuspense'
export { getSkillsSuspenseQueryOptions } from './hooks/skillsController/useGetSkillsSuspense'
export { useGetSkillsSuspense } from './hooks/skillsController/useGetSkillsSuspense'
export {
	getExample200Schema,
	getExample404Schema,
	getExampleQueryResponseSchema,
} from './zod/exampleController/getExampleSchema'
export { skillSchema } from './zod/skillSchema'
export {
	getSkills200Schema,
	getSkillsQueryParamsSchema,
	getSkillsQueryResponseSchema,
} from './zod/skillsController/getSkillsSchema'
