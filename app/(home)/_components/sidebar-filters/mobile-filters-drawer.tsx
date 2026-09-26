'use client'

import { Button, Drawer, DrawerContent, DrawerTrigger } from '@repo/core'
import { Settings } from 'lucide-react'

import { FiltersContent } from './filters-content'

export function MobileFiltersDrawer() {
	return (
		<Drawer>
			<DrawerTrigger
				render={
					<Button
						aria-label="Открыть фильтры"
						variant="outline"
						size="icon-lg"
						className="size-12 bg-(--outline-backdrop-tint) backdrop-blur-(--outline-backdrop-blur)"
					>
						<Settings className="size-6" />
					</Button>
				}
			/>

			<DrawerContent className="min-h-[80vh]">
				<div className="min-h-0 flex-1 overflow-y-auto p-5 pt-8">
					<FiltersContent />
				</div>
			</DrawerContent>
		</Drawer>
	)
}
