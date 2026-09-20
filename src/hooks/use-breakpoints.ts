'use client'

import { useMediaQuery } from './use-media-query'

const breakpointsDobroUi = {
	lg: 992,
	md: 768,
	sm: 576,
	xl: 1200,
	xxl: 1400,
}

interface UseBreakpointsReturn {
	gtLg: boolean
	gtMd: boolean
	gtSm: boolean
	gtXl: boolean
	gtXxl: boolean
}

export function useBreakpoints(): UseBreakpointsReturn {
	const gtSm = useMediaQuery(`(min-width: ${breakpointsDobroUi.sm.toString()}px)`)
	const gtMd = useMediaQuery(`(min-width: ${breakpointsDobroUi.md.toString()}px)`)
	const gtLg = useMediaQuery(`(min-width: ${breakpointsDobroUi.lg.toString()}px)`)
	const gtXl = useMediaQuery(`(min-width: ${breakpointsDobroUi.xl.toString()}px)`)
	const gtXxl = useMediaQuery(`(min-width: ${breakpointsDobroUi.xxl.toString()}px)`)

	return { gtLg, gtMd, gtSm, gtXl, gtXxl }
}
