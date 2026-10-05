'use client'

import type { CurrentUser } from '#/lib/auth/get-session'
import type { UpdateAvatarAction } from '#/modules/auth/types'

import { getAuthMeQueryKey } from '@repo/api'
import { Spinner } from '@repo/core'
import { useQueryClient } from '@tanstack/react-query'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { getAvatarDisplayUrl } from '#/lib/auth/avatar-url'
import { AVATAR_ACCEPT, getAvatarFileError } from '#/modules/auth/avatar'

interface ProfileAvatarUploadProps {
	action: UpdateAvatarAction
	user: CurrentUser
}

export function ProfileAvatarUpload({ action, user }: ProfileAvatarUploadProps) {
	const queryClient = useQueryClient()
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | undefined>(undefined)

	async function uploadFile(file: File) {
		const objectUrl = URL.createObjectURL(file)
		setPreviewUrl(objectUrl)
		setIsUploading(true)

		const formData = new FormData()
		formData.set('avatar', file)
		const result = await action(formData)

		URL.revokeObjectURL(objectUrl)
		setPreviewUrl(undefined)
		setIsUploading(false)

		if (!result.ok) {
			setError(result.error)
			return
		}

		queryClient.setQueryData(getAuthMeQueryKey(), (current) =>
			current == null ? current : { ...current, image: result.image },
		)
	}

	function handleFileChange(file: File | undefined) {
		if (file == null) {
			return
		}

		const validationError = getAvatarFileError(file)

		if (validationError != null) {
			setError(validationError)
			return
		}

		setError(undefined)
		void uploadFile(file)
	}

	return (
		<div className="v-stack items-center gap-2">
			<label htmlFor="profile-avatar-file" className={`
				group relative z-10 block size-20 shrink-0 cursor-pointer overflow-hidden
				rounded-full bg-card
			`}>
				{previewUrl == null ? (
					<Avatar user={user} />
				) : (
					<span
						role="img"
						aria-label="Предпросмотр нового фото"
						className="block size-full bg-cover bg-center"
						style={{ backgroundImage: `url(${previewUrl})` }}
					/>
				)}
				<span className={`
					absolute inset-0 flex items-center justify-center bg-black/0 opacity-0
					transition-[background-color,opacity] duration-200
					group-hover:bg-black/40 group-hover:opacity-100
				`}>
					<Camera className="size-6 text-white" aria-hidden="true" />
				</span>
				{isUploading ? (
					<span className="absolute inset-0 flex items-center justify-center bg-black/40">
						<Spinner className="size-6 text-white" />
					</span>
				) : null}
				<input
					id="profile-avatar-file"
					aria-label="Изменить фото профиля"
					className="sr-only"
					type="file"
					accept={AVATAR_ACCEPT}
					disabled={isUploading}
					onChange={(event) => {
						handleFileChange(event.target.files?.[0])
						event.target.value = ''
					}}
				/>
			</label>
			{error == null ? null : (
				<p role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	)
}

function Avatar({ user }: { user: CurrentUser }) {
	if (user.image == null) {
		return (
			<span
				aria-hidden="true"
				className="flex size-full items-center justify-center text-lg font-semibold"
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
