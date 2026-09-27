import type { CurrentUser } from '#/lib/auth/get-session'

import { Avatar } from './avatar'

interface AccountSummaryProps {
	user: CurrentUser
}

export function AccountSummary({ user }: AccountSummaryProps) {
	return (
		<div className="flex items-center gap-3">
			<span className="size-10 shrink-0 overflow-hidden rounded-full bg-heading/10 border-shaded">
				<Avatar user={user} />
			</span>

			<div className="v-stack min-w-0 gap-0.5">
				<span className="truncate text-sm font-medium">{user.name}</span>
				<span className="truncate text-sm text-muted-foreground">{user.email}</span>
			</div>
		</div>
	)
}
