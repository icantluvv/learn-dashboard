'use client'

import { cn } from '@repo/core'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { AVATAR_ACCEPT, getAvatarFileError } from '#/modules/auth/avatar'

interface AvatarDropzoneProps {
	error?: string
	value: File | null
	onChange: (file: File | null) => void
	onError: (message: string | undefined) => void
}

export function AvatarDropzone({ error, onChange, onError, value }: AvatarDropzoneProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

	useEffect(() => {
		return () => {
			if (previewUrl != null) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	}, [previewUrl])

	function selectFile(file: File | undefined) {
		if (file == null) {
			return
		}

		const message = getAvatarFileError(file)
		onError(message)

		if (message == null) {
			setPreviewUrl(URL.createObjectURL(file))
			onChange(file)
		} else {
			setPreviewUrl(undefined)
			onChange(null)
		}
	}

	function removeFile() {
		if (inputRef.current != null) {
			inputRef.current.value = ''
		}

		onError(undefined)
		setPreviewUrl(undefined)
		onChange(null)
	}

	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm font-medium">Аватар</span>
			<div
				data-testid="avatar-dropzone"
				className={cn(`
					flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border
					border-dashed bg-select-background p-4 text-center transition-colors
				`, isDragging ? 'border-primary bg-primary/5' : 'border-outline-border', error == null ? '' : 'border-destructive bg-destructive/5')}
				onDragEnter={(event) => {
					event.preventDefault()
					setIsDragging(true)
				}}
				onDragLeave={(event) => {
					event.preventDefault()
					setIsDragging(false)
				}}
				onDragOver={(event) => event.preventDefault()}
				onDrop={(event) => {
					event.preventDefault()
					setIsDragging(false)
					selectFile(event.dataTransfer.files[0])
				}}
			>
				<input
					ref={inputRef}
					id="avatar-file"
					className="sr-only"
					type="file"
					accept={AVATAR_ACCEPT}
					aria-describedby={error == null ? 'avatar-help' : 'avatar-error'}
					aria-invalid={error == null ? undefined : true}
					onChange={(event) => selectFile(event.target.files?.[0])}
				/>

				{previewUrl == null ? (
					<>
						<p className="text-sm text-foreground">
							<span className="block">Перетащите изображение сюда</span>
							<span className="block">или выберите файл</span>
						</p>
						<label htmlFor="avatar-file" className={`
							inline-flex min-h-10 cursor-pointer items-center rounded-lg border
							border-outline-border px-4 text-sm font-medium text-outline-border
							transition-colors
							hover:bg-outline-hover-background hover:text-outline-hover-foreground
						`}>
							Выбрать изображение
						</label>
					</>
				) : (
					<>
						<span className="group relative block size-16 shrink-0 overflow-hidden rounded-full">
							<span
								role="img"
								aria-label="Предпросмотр аватара"
								className="block size-full bg-cover bg-center"
								style={{ backgroundImage: `url(${previewUrl})` }}
							/>
							<button type="button" aria-label="Удалить изображение" className={`
								absolute inset-0 flex cursor-pointer items-center justify-center
								rounded-full bg-black/55 text-white opacity-0 transition-opacity
								group-hover:opacity-100
								focus-visible:opacity-100 focus-visible:ring-2
								focus-visible:ring-ring focus-visible:ring-offset-2
								focus-visible:outline-none
							`} onClick={removeFile}>
								<X aria-hidden="true" className="size-7" />
							</button>
						</span>
						<p className="max-w-full truncate text-sm">{value?.name}</p>
					</>
				)}
			</div>
			<p id="avatar-help" className="text-xs text-foreground">
				JPEG, PNG или WebP, не более 5 МБ
			</p>
			{error == null ? null : (
				<p id="avatar-error" role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	)
}
