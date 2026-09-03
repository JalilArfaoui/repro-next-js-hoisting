import { css, styled } from 'styled-components'

export const BodyStyle = css`
	font-family: ${({ theme }) => theme.fonts.main};
	font-size: ${({ theme }) => theme.fontSizes.base};
`

export const Body = styled.p`
	${BodyStyle}
`
export { InfoButton } from './InfoButton'
export { DesignSystemThemeProvider } from './root'
export { default as Meta } from '@/Meta'
