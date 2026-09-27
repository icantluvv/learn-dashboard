import { NextResponse } from 'next/server'

import { getDashboardStats } from '#/modules/dashboard/server/dashboard-stats-repository'

export async function GET() {
	const stats = await getDashboardStats()

	return NextResponse.json(stats, { headers: { 'Cache-Control': 'no-store' } })
}
