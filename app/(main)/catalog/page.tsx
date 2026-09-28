import { buildPageMetadata } from '#/seo'
import { CoreBanners } from '@/(main)/catalog/_components/core-banners'

export const metadata = buildPageMetadata({
	title: 'Направления обучения',
	description:
		'Выберите направление подготовки — Frontend, Backend, DevOps или Design — и переходите ' +
		'к навыкам, темам и вопросам для самопроверки.',
	path: '/catalog',
})

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
