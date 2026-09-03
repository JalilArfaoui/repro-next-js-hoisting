'use client'

import { useTranslation } from 'react-i18next'

import { Body } from '@/design-system'

export default function Home() {
	const { t } = useTranslation()

	return <Body>{t('k', 'pour vous.')}</Body>
}
