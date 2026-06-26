import type { NextConfig } from 'next/dist/server/config-shared'

const isDev = process.env.NODE_ENV === 'development'

export const headers: NextConfig['headers'] = async () => {
	if (isDev) {
		return []
	}

	return [
		{
			headers: [
				{
					key: 'X-Accel-Buffering',
					value: 'no',
				},
			],
			source: '/:path*{/}?',
		},
		{
			headers: [
				{
					key: 'Cache-Control',
					value: `public, max-age=31536000, stale-while-revalidate`,
				},
			],
			locale: false,
			source: '/:all*(svg|jpg|png|jpeg|woff|woff2|webp|ico)',
		},
		{
			headers: [
				{
					key: 'X-DNS-Prefetch-Control',
					value: 'on',
				},
				{
					key: 'X-XSS-Protection',
					value: '0',
				},
				{
					key: 'X-Content-Type-Options',
					value: 'nosniff',
				},
				{
					key: 'X-Permitted-Cross-Domain-Policies',
					value: 'none',
				},
				{
					key: 'Content-Security-Policy',
					value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://mc.yandex.ru https://mc.yandex.com https://yastatic.net https://top-fwz1.mail.ru https://privacy-cs.mail.ru https://telegram.org;
                            worker-src 'self' blob:;
                            style-src 'self' 'unsafe-inline';
                            img-src 'self' blob: data: https://storage.yandexcloud.net https://mc.yandex.ru https://mc.yandex.com https://yastatic.net https://top-fwz1.mail.ru https://ad.mail.ru;
                            media-src 'self' blob: https://storage.yandexcloud.net;
                            font-src 'self';
                            object-src 'none';
                            base-uri 'self';
                            form-action 'self';
                            frame-src 'self' https://mc.yandex.ru https://top-fwz1.mail.ru;
                            frame-ancestors *;
                            upgrade-insecure-requests;
                            connect-src 'self' data: wss: ws: https://mc.yandex.ru https://mc.yandex.com https://top-fwz1.mail.ru https://privacy-cs.mail.ru https://ad.mail.ru https://telegram.org https://tr.telegram.org
                        `.replaceAll('\n', ''),
				},
				{
					key: 'Cross-Origin-Opener-Policy',
					value: 'same-origin',
				},
				{
					key: 'Cross-Origin-Resource-Policy',
					value: 'same-origin',
				},
				{
					key: 'Referrer-Policy',
					value: 'no-referrer',
				},
				{
					key: 'Strict-Transport-Security',
					value: 'max-age=31536000; includeSubDomains',
				},
				{
					key: 'Permissions-Policy',
					value: `
                            accelerometer=(),
                            autoplay=(),
                            camera=(),
                            cross-origin-isolated=(),
                            display-capture=(),
                            encrypted-media=(),
                            fullscreen=(),
                            geolocation=(),
                            gyroscope=(),
                            keyboard-map=(),
                            magnetometer=(),
                            microphone=(),
                            midi=(),
                            payment=(),
                            picture-in-picture=(),
                            publickey-credentials-get=(),
                            screen-wake-lock=(),
                            sync-xhr=(self),
                            usb=(),
                            xr-spatial-tracking=(),
                            gamepad=(),
                            hid=(),
                            idle-detection=(),
                            interest-cohort=(),
                            serial=(),
                            unload=()
                            `.replaceAll('\n', ''),
				},
			],
			source: '/:path*',
		},
	]
}
