'use client'

import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { Body } from '@/design-system'

export function PageLayout({ children }: { children: ReactNode }) {
	const { t } = useTranslation()

	return (
		<div>
			<Helmet>
				<link rel="alternate" hrefLang="en" href="/x" />
			</Helmet>

			<main>{children}</main>

			<footer>
				{t('footer', 'pied')}<Body>!</Body>
			</footer>
		</div>
	)
}
