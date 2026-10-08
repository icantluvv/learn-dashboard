import type { CurrentUser } from '#/lib/auth/get-session'

import Image from 'next/image'

import { getAvatarDisplayUrl } from '#/lib/auth/avatar-url'

export function ProfileAvatar({ user }: { user: CurrentUser }) {
	if (user.image == null) {
		return (
			<span
				aria-hidden="true"
				className="flex size-full items-center justify-center text-lg font-semibold text-white"
			>
				{user.name.slice(0, 1).toUpperCase()}
			</span>
		)
	}

	return (
		<Image
			src={getAvatarDisplayUrl(user.image)}
			alt=""
			width={80}
			height={80}
			className="size-full object-cover"
			unoptimized
		/>
	)
}
