import { ReactNode } from 'react'
import { ConnectKitButton } from 'connectkit'
import CustomSismoConnectButton from './SismoConnectButton'
import { Flex, Menu, Image, Spacer, Box } from '@chakra-ui/react'

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
				<Box margin="20px">
					<ConnectKitButton />
				</Box>
			</Flex>
			<Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height="90vh">
				<CustomSismoConnectButton
					url={''}
					vote={false}
					setSingature={function (signature: string): void {
						throw new Error('Function not implemented.')
					}}
				/>
				{children}
			</Flex>
		</Menu>
	)
}
