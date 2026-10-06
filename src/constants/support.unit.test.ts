import { describe, expect, it } from 'vitest'

import { SUPPORT_EMAIL, SUPPORT_MAILTO_URL, SUPPORT_TELEGRAM_URL } from '#/constants/support'

describe('support contacts', () => {
	it('содержит непустой адрес почты поддержки', () => {
		expect(SUPPORT_EMAIL).not.toBe('')
		expect(SUPPORT_EMAIL).toContain('@')
	})

	it('содержит непустую ссылку на Telegram поддержки', () => {
		expect(SUPPORT_TELEGRAM_URL).not.toBe('')
		expect(SUPPORT_TELEGRAM_URL.startsWith('https://')).toBe(true)
	})

	it('формирует mailto-адрес из адреса почты поддержки', () => {
		expect(SUPPORT_MAILTO_URL).toBe(`mailto:${SUPPORT_EMAIL}`)
	})
})
