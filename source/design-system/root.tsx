// Repro instrumentation: this module holds the styled-components theme object.
// When Turbopack's scope hoisting duplicates the merged module, this counter goes above 1
// and the theme singleton exists twice, which crashes the app during hydration.
if (typeof window !== 'undefined') {
	const g = globalThis as { __THEME_MODULE_EVALS?: number }
	g.__THEME_MODULE_EVALS = (g.__THEME_MODULE_EVALS ?? 0) + 1
	if (g.__THEME_MODULE_EVALS > 1) {
		// eslint-disable-next-line no-console
		console.warn(
			'[repro] theme module evaluated ' +
				String(g.__THEME_MODULE_EVALS) +
				' times: module-level singletons are duplicated'
		)
	}
}

export const baseTheme = {
	colors: {
		bases: {
			primary: { 700: '#1D458C' },
		},
	},
	fonts: {
		main: "'Roboto', sans-serif",
	},
	fontSizes: {
		base: '1rem',
	},
	darkMode: false,
}

// The computed (non-hoistable) export is part of the trigger: its registration
// cannot be raised to the top of a merged factory.
const theme = {
	...baseTheme,
	spacing: Object.values(baseTheme.fontSizes),
}

const urssafTheme = theme

import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'



type SystemRootProps = {
	children: ReactNode
	forceDarkMode?: boolean
}

const SystemRoot = ({ children, forceDarkMode }: SystemRootProps) => (
	<ThemeProvider
		theme={{ ...urssafTheme, darkMode: !!forceDarkMode, isInIframe: false }}
	>
		<>
			{children}
		</>
	</ThemeProvider>
)

export default SystemRoot
export { SystemRoot as DesignSystemThemeProvider }
