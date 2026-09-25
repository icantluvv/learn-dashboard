'use client'

import { Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@repo/core'
import { Settings } from 'lucide-react'

import { FiltersContent } from './filters-content'

export function MobileFiltersDrawer() {
	return (
		<Drawer>
			<DrawerTrigger
				render={
					<Button aria-label="Открыть фильтры" variant="outline" size="icon-lg">
						<Settings className="size-5" />
					</Button>
				}
			/>

			<DrawerContent className="min-h-[80vh]">
				<DrawerHeader>
					<DrawerTitle>Фильтры</DrawerTitle>
				</DrawerHeader>

				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<FiltersContent />
				</div>
			</DrawerContent>
		</Drawer>
	)
}
