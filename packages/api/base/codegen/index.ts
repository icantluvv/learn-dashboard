export type { GetCoresQueryKey } from './hooks/coresController/useGetCores'
export type { GetCoresSuspenseQueryKey } from './hooks/coresController/useGetCoresSuspense'
export type { GetDashboardStatsQueryKey } from './hooks/dashboardController/useGetDashboardStats'
export type { GetDashboardStatsSuspenseQueryKey } from './hooks/dashboardController/useGetDashboardStatsSuspense'
export type { GetExampleQueryKey } from './hooks/exampleController/useGetExample'
export type { GetExampleSuspenseQueryKey } from './hooks/exampleController/useGetExampleSuspense'
export type { GetAuthMeQueryKey } from './hooks/meController/useGetAuthMe'
export type { GetAuthMeSuspenseQueryKey } from './hooks/meController/useGetAuthMeSuspense'
export type { GetSkillByIdQueryKey } from './hooks/skillsController/useGetSkillById'
export type { GetSkillByIdSuspenseQueryKey } from './hooks/skillsController/useGetSkillByIdSuspense'
export type { GetSkillsQueryKey } from './hooks/skillsController/useGetSkills'
export type { GetSkillsSuspenseQueryKey } from './hooks/skillsController/useGetSkillsSuspense'
export type { AuthMe } from './types/AuthMe'
export type { Core } from './types/Core'
export type { DashboardStats } from './types/DashboardStats'
export type { Skill } from './types/Skill'
export type {
	GetCores200,
	GetCoresQuery,
	GetCoresQueryResponse,
} from './types/coresController/GetCores'
export type {
	GetDashboardStats200,
	GetDashboardStatsQuery,
	GetDashboardStatsQueryResponse,
} from './types/dashboardController/GetDashboardStats'
export type {
	GetExample200,
	GetExample404,
	GetExampleQuery,
	GetExampleQueryResponse,
} from './types/exampleController/GetExample'
export type {
	GetAuthMe200,
	GetAuthMe401,
	GetAuthMeQuery,
	GetAuthMeQueryResponse,
} from './types/meController/GetAuthMe'
export type {
	GetSkillById200,
	GetSkillById404,
	GetSkillByIdPathParams,
	GetSkillByIdQuery,
	GetSkillByIdQueryResponse,
} from './types/skillsController/GetSkillById'
export type {
	GetSkills200,
	GetSkillsQuery,
	GetSkillsQueryParams,
	GetSkillsQueryResponse,
} from './types/skillsController/GetSkills'
export { getCores } from './clients/coresController/getCores'
export { getDashboardStats } from './clients/dashboardController/getDashboardStats'
export { getExample } from './clients/exampleController/getExample'
export { getAuthMe } from './clients/meController/getAuthMe'
export { getSkillById } from './clients/skillsController/getSkillById'
export { getSkills } from './clients/skillsController/getSkills'
export { getCoresQueryKey } from './hooks/coresController/useGetCores'
export { getCoresQueryOptions } from './hooks/coresController/useGetCores'
export { useGetCores } from './hooks/coresController/useGetCores'
export { getCoresSuspenseQueryKey } from './hooks/coresController/useGetCoresSuspense'
export { getCoresSuspenseQueryOptions } from './hooks/coresController/useGetCoresSuspense'
export { useGetCoresSuspense } from './hooks/coresController/useGetCoresSuspense'
export { getDashboardStatsQueryKey } from './hooks/dashboardController/useGetDashboardStats'
export { getDashboardStatsQueryOptions } from './hooks/dashboardController/useGetDashboardStats'
export { useGetDashboardStats } from './hooks/dashboardController/useGetDashboardStats'
export { getDashboardStatsSuspenseQueryKey } from './hooks/dashboardController/useGetDashboardStatsSuspense'
export { getDashboardStatsSuspenseQueryOptions } from './hooks/dashboardController/useGetDashboardStatsSuspense'
export { useGetDashboardStatsSuspense } from './hooks/dashboardController/useGetDashboardStatsSuspense'
export { getExampleQueryKey } from './hooks/exampleController/useGetExample'
export { getExampleQueryOptions } from './hooks/exampleController/useGetExample'
export { useGetExample } from './hooks/exampleController/useGetExample'
export { getExampleSuspenseQueryKey } from './hooks/exampleController/useGetExampleSuspense'
export { getExampleSuspenseQueryOptions } from './hooks/exampleController/useGetExampleSuspense'
export { useGetExampleSuspense } from './hooks/exampleController/useGetExampleSuspense'
export { getAuthMeQueryKey } from './hooks/meController/useGetAuthMe'
export { getAuthMeQueryOptions } from './hooks/meController/useGetAuthMe'
export { useGetAuthMe } from './hooks/meController/useGetAuthMe'
export { getAuthMeSuspenseQueryKey } from './hooks/meController/useGetAuthMeSuspense'
export { getAuthMeSuspenseQueryOptions } from './hooks/meController/useGetAuthMeSuspense'
export { useGetAuthMeSuspense } from './hooks/meController/useGetAuthMeSuspense'
export { getSkillByIdQueryKey } from './hooks/skillsController/useGetSkillById'
export { getSkillByIdQueryOptions } from './hooks/skillsController/useGetSkillById'
export { useGetSkillById } from './hooks/skillsController/useGetSkillById'
export { getSkillByIdSuspenseQueryKey } from './hooks/skillsController/useGetSkillByIdSuspense'
export { getSkillByIdSuspenseQueryOptions } from './hooks/skillsController/useGetSkillByIdSuspense'
export { useGetSkillByIdSuspense } from './hooks/skillsController/useGetSkillByIdSuspense'
export { getSkillsQueryKey } from './hooks/skillsController/useGetSkills'
export { getSkillsQueryOptions } from './hooks/skillsController/useGetSkills'
export { useGetSkills } from './hooks/skillsController/useGetSkills'
export { getSkillsSuspenseQueryKey } from './hooks/skillsController/useGetSkillsSuspense'
export { getSkillsSuspenseQueryOptions } from './hooks/skillsController/useGetSkillsSuspense'
export { useGetSkillsSuspense } from './hooks/skillsController/useGetSkillsSuspense'
export { authMeSchema } from './zod/authMeSchema'
export { coreSchema } from './zod/coreSchema'
export {
	getCores200Schema,
	getCoresQueryResponseSchema,
} from './zod/coresController/getCoresSchema'
export {
	getDashboardStats200Schema,
	getDashboardStatsQueryResponseSchema,
} from './zod/dashboardController/getDashboardStatsSchema'
export { dashboardStatsSchema } from './zod/dashboardStatsSchema'
export {
	getExample200Schema,
	getExample404Schema,
	getExampleQueryResponseSchema,
} from './zod/exampleController/getExampleSchema'
export {
	getAuthMe200Schema,
	getAuthMe401Schema,
	getAuthMeQueryResponseSchema,
} from './zod/meController/getAuthMeSchema'
export { skillSchema } from './zod/skillSchema'
export {
	getSkillById200Schema,
	getSkillById404Schema,
	getSkillByIdPathParamsSchema,
	getSkillByIdQueryResponseSchema,
} from './zod/skillsController/getSkillByIdSchema'
export {
	getSkills200Schema,
	getSkillsQueryParamsSchema,
	getSkillsQueryResponseSchema,
} from './zod/skillsController/getSkillsSchema'
