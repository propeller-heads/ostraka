import { ReactNode } from 'react'
import { ConnectKitButton } from 'connectkit'
import CustomSismoConnectButton from './SismoConnectButton'
import { Flex, Menu, Image, Spacer, Box } from '@chakra-ui/react'

type Props = {
	children?: ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<>
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
				<Spacer />
				<Box margin="20px">
					<ConnectKitButton />
				</Box>
			</Flex>
			<Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height="90vh">
				<CustomSismoConnectButton />
				{children}
			</Flex>
		</>
	)
}
