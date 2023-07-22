import '@/styles/globals.css'
import { APP_NAME } from '@/lib/consts'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi'

const { publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()])
const config = createConfig({
	autoConnect: true,
	publicClient,
	webSocketPublicClient,
})

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
