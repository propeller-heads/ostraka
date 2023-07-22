import { ReactNode } from 'react'
import CustomSismoConnectButton from './SismoConnectButton'
import { Flex, Menu, Image, Spacer } from '@chakra-ui/react'

type Props = {
	children?: ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<Flex
			flexDirection="row"
			alignItems="center"
			justifyContent={'space-between'}
			background="#02111B"
			height="100px"
		>
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
	)
}
