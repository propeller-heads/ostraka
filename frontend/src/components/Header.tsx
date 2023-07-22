import { ReactNode } from 'react'
import CustomSismoConnectButton from './SismoConnectButton'
import { Flex, Menu, Image, Spacer } from '@chakra-ui/react'

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
				<CustomSismoConnectButton />
				<Spacer hideFrom={'md'} />
				{children}
			</Flex>
		</Menu>
	)
}
