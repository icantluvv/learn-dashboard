import { FiltersContent } from './filters-content'

export function DesktopFiltersSidebar() {
	return (
		<aside className={`
			sticky top-6 max-w-2/5 min-w-1/5 shrink-0 basis-1/4 self-start rounded-2xl border
			bg-card p-6 text-foreground border-shaded
		`}>
			<FiltersContent />
		</aside>
	)
}
