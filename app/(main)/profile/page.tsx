import { removeAvatarAction, updateAvatarAction } from '#/modules/auth'
import { buildPageMetadata } from '#/seo'
import { ProfileView } from '@/(main)/profile/_components/profile-view'

export const metadata = buildPageMetadata({
	title: 'Профиль',
	description: 'Личные данные аккаунта и настройки профиля.',
	path: '/profile',
	noIndex: true,
})

export default function ProfilePage() {
	return (
		<div className="page-wrapper flex flex-1 flex-col">
			<ProfileView
				removeAvatarAction={removeAvatarAction}
				updateAvatarAction={updateAvatarAction}
			/>
		</div>
	)
}
