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
			<Flex flexDirection="column" alignItems="center">
				<br />
				<VoteStepper currentStep={1} />
				<br />
				<br />

				<Box w="50rem">
					<Text fontSize="18px" color="white" textAlign="center">
						Welcome to ostraka! A cutting-edge blockchain voting system that revolutionizes the way we
						participate in democratic processes. Embrace a new era of voting with unprecedented freedom and
						expression, allowing you to have a direct impact on the decisions that matter most to you.
					</Text>
				</Box>
			</Flex>

			<Flex
				flexDirection={'column'}
				alignItems={'center'}
				justifyContent={'center'}
				height="50vh"
				maxWidth="800px"
				margin="0 auto"
			>
				{children}
			</Flex>
		</>
	)
}
