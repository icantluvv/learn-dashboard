import type { CurrentUser } from '#/lib/auth/get-session'

import { AccountSummary } from './account-summary'

interface ProfileCardProps {
	user: CurrentUser
}

export function ProfileCard({ user }: ProfileCardProps) {
	return <AccountSummary user={user} className="min-w-0" />
}
