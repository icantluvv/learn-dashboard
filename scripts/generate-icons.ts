import { readFileSync } from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

const publicDir = path.join(import.meta.dirname, '..', 'public')

async function render(svgFile: string, size: number, outFile: string) {
	const svg = readFileSync(path.join(publicDir, svgFile))

	await sharp(svg).resize(size, size).png().toFile(path.join(publicDir, outFile))

	console.log(`${outFile} (${size}x${size})`)
}

await render('icon.svg', 192, 'icon-192.png')
await render('icon.svg', 512, 'icon-512.png')
await render('icon.svg', 180, 'apple-touch-icon.png')
