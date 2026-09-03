/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: { ignoreBuildErrors: true },

	compiler: {
		styledComponents: true,
	},

	env: {
		LANGUE: process.env.LANGUE ?? 'fr',
	},
}

export default nextConfig
