import { Providers } from '@/providers'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head />
			<body style={{ background: '#5D737E' }}>
				<Providers>
					<Main />
					<NextScript />
				</Providers>
			</body>
		</Html>
	)
}
