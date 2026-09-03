import { Helmet } from 'react-helmet-async'

export default function Meta({
	title,
	description,
}: {
	title: string
	description?: string
}) {
	return (
		<Helmet title={title}>
			<meta
				name="description"
				content={description ?? 'Des simulateurs'}
			/>
		</Helmet>
	)
}
