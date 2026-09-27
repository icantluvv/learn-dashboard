import { expect, test } from './fixtures'

interface WebAppManifestIcon {
	purpose?: string
	src: string
}

interface WebAppManifest {
	description: string
	display: string
	icons: WebAppManifestIcon[]
	name: string
	short_name: string
	start_url: string
}

test('манифест отдаётся и заполнен', async ({ request }) => {
	const response = await request.get('/manifest.webmanifest')

	expect(response.ok()).toBe(true)

	const manifest = (await response.json()) as WebAppManifest

	expect(manifest.name).toBeTruthy()
	expect(manifest.short_name).toBeTruthy()
	expect(manifest.description).toBeTruthy()
	expect(manifest.display).toBe('standalone')
	expect(manifest.start_url).toBe('/')
})

test('каждая иконка из манифеста и apple-touch-icon отдаются как изображения', async ({
	request,
}) => {
	const manifestResponse = await request.get('/manifest.webmanifest')
	const manifest = (await manifestResponse.json()) as WebAppManifest

	const iconPaths = [...manifest.icons.map((icon) => icon.src), '/apple-touch-icon.png']

	for (const path of iconPaths) {
		const response = await request.get(path)

		expect(response.ok(), `${path} should respond 200`).toBe(true)
		expect(response.headers()['content-type']).toMatch(/^image\//)
	}
})

test('HTML главной ссылается на манифест', async ({ request }) => {
	const response = await request.get('/')
	const html = await response.text()

	expect(html).toContain('manifest.webmanifest')
})

test('манифест объявляет маскируемую иконку', async ({ request }) => {
	const response = await request.get('/manifest.webmanifest')
	const manifest = (await response.json()) as WebAppManifest

	const maskable = manifest.icons.find((icon) => icon.purpose?.includes('maskable'))

	expect(maskable).toBeDefined()
})
