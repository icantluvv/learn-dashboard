import { NextResponse } from 'next/server'

import { getCores } from '#/modules/cores/server/cores-repository'

export async function GET() {
	const cores = await getCores()

	return NextResponse.json(cores, { headers: { 'Cache-Control': 'no-store' } })
}
