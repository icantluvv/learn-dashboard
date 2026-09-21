'use client'

import { Button, Drawer } from '@heroui/react'
import { Settings } from 'lucide-react'

import { FiltersContent } from './filters-content'

export function MobileFiltersDrawer() {
	return (
		<Drawer.Root>
			<Button aria-label="Открыть фильтры" variant="outline" isIconOnly>
				<Settings className="size-5" />
			</Button>

			<Drawer.Backdrop>
				<Drawer.Content placement="bottom">
					<Drawer.Dialog aria-label="Фильтры" className="min-h-[80vh]">
						<Drawer.Body>
							<FiltersContent />
						</Drawer.Body>
					</Drawer.Dialog>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer.Root>
	)
}
