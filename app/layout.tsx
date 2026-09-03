import { ReactNode } from 'react'

import { PageLayout } from '@/PageLayout'

import { ClientProviders } from './ClientProviders'

export const metadata = {
	title: 'Repro',
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="fr">
			<body>
				<ClientProviders langueParDéfaut="fr">
					<PageLayout>{children}</PageLayout>
				</ClientProviders>
			</body>
		</html>
	)
}
