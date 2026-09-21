interface CatalogSkillPageProps {
	params: Promise<{ id: string }>
}

export default async function CatalogSkillPage({ params }: CatalogSkillPageProps) {
	const { id } = await params

	return (
		<section className="rounded-xl bg-white p-6">
			<p className="text-sm text-gray-600">Навык {id}</p>
		</section>
	)
}
