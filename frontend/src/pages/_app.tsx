import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { optimismGoerli } from 'wagmi/chains'
import { ChakraProvider } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const { publicClient, webSocketPublicClient } = configureChains([optimismGoerli], [publicProvider()])
const config = createConfig(
	getDefaultConfig({
		walletConnectProjectId: '09f9be6afc293b3553b955330dc5f9c4',
		appName: 'Ostraka',
	})
)

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig config={config}>
			<ConnectKitProvider>
				<ChakraProvider>
					<Component {...pageProps} />
				</ChakraProvider>
			</ConnectKitProvider>
		</WagmiConfig>
	)
}
