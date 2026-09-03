import { ReactNode } from 'react'

import { Body } from '@/design-system'

export function InfoButton({
	description,
}: {
	description?: string | ReactNode
}) {
	if (!description) {
		return null
	}

	return <Body>{description}</Body>
}
