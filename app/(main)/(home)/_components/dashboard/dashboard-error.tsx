export function DashboardError() {
	return (
		<section className="flex min-w-0 flex-1 items-center justify-center rounded-xl bg-card p-6">
			<p className="text-base text-muted-foreground">
				Не удалось загрузить статистику каталога. Попробуйте обновить страницу.
			</p>
		</section>
	)
}
