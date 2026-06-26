import localFont from 'next/font/local'

export const ttFors = localFont({
	src: [
		{ path: './source/TT Fors Trial Thin.woff2', weight: '100' },
		{ path: './source/TT Fors Trial ExtraLight.woff2', weight: '200' },
		{ path: './source/TT Fors Trial Light.woff2', weight: '300' },
		{ path: './source/TT Fors Trial Regular.woff2', weight: '400' },
		{ path: './source/TT Fors Trial Medium.woff2', weight: '500' },
		{ path: './source/TT Fors Trial DemiBold.woff2', weight: '600' },
		{ path: './source/TT Fors Trial Bold.woff2', weight: '700' },
		{ path: './source/TT Fors Trial ExtraBold.woff2', weight: '800' },
		{ path: './source/TT Fors Trial Black.woff2', weight: '900' },
	],
	variable: '--font-tt-fors',
})
