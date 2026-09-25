'use client'

import { Button } from '@repo/core'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BackButton() {
	const router = useRouter()

	return (
		<Button className={`
			w-fit gap-2 px-0 text-sm font-medium text-black transition-colors duration-200
			hover:bg-transparent hover:text-gray-600
		`} variant="ghost" onClick={() => router.back()}>
			<ArrowLeft className="size-4" />
			Назад
		</Button>
	)
}
