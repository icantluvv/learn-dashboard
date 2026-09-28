import { CoreBanners } from '@/(main)/catalog/_components/core-banners'

export default function CatalogPage() {
	return (
		<div className="page-wrapper v-stack gap-6">
			<section className="v-stack gap-2">
				<h1 className="text-3xl font-semibold text-heading">Направление</h1>
				<p className="text-base text-muted-foreground">Выбери из списка для изучения</p>
			</section>

			<CoreBanners />
		</div>
	)
}
