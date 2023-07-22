import { ReactNode } from 'react'
import CustomSismoConnectButton from './SismoConnectButton'
import { Flex, Menu, Image, Spacer } from '@chakra-ui/react'
import { ConnectKitButton } from 'connectkit'


type Props = {
	children?: ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<Menu>
			<Flex layerStyle={'headerFlex'}>
				<Image
					boxSize="3rem"
					hideBelow={'md'}
					style={{ width: '199.94px' }}
					ml={5}
					src="ostraka.svg"
					alt="ostraka"
				/>
				<Spacer />
				<ConnectKitButton />
			</Flex>
			<Flex>
				<CustomSismoConnectButton />
				{children}
			</Flex>
		</Menu>
	)
}
