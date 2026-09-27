import type { ReactNode } from 'react'

import { Layout } from '#/components/layout'

export default function MainLayout({ children }: { children: ReactNode }) {
	return <Layout>{children}</Layout>
}
