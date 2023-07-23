import { ReactNode } from 'react'
import { VoteStepper } from './VoteStepper'
import { ConnectKitButton } from 'connectkit'
import { Flex, Text, Image, Spacer, Box } from '@chakra-ui/react'

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
				background="#331E36"
				height="100px"
			>
				<Image
					boxSize="4rem"
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
			{children}
		</>
	)
}
