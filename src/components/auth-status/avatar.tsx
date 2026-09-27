import type { CurrentUser } from '#/lib/auth/get-session'

import Image from 'next/image'

interface AvatarProps {
	size?: number
	user: CurrentUser
}

export function Avatar({ size = 40, user }: AvatarProps) {
	if (user.image == null) {
		return (
			<span
				aria-hidden="true"
				className="flex size-full items-center justify-center text-sm font-semibold"
			>
				{user.name.slice(0, 1).toUpperCase()}
			</span>
		)
	}

	return (
		<Image
			src={user.image}
			alt=""
			width={size}
			height={size}
			className="size-full object-cover"
			unoptimized
		/>
	)
}
