import { useRef } from 'react'
import {
	Text,
	Drawer,
	useDisclosure,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	Card,
	CardHeader,
	Heading,
	CardBody,
	DrawerFooter,
	StatGroup,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	Spacer,
} from '@chakra-ui/react'

type Props = {
	hasVoted: boolean
}

export default function VoteDetails({ hasVoted }: Props) {
	const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: hasVoted })
	const btnRef = useRef(null)

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="sm">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader textAlign="center" fontSize="30px" fontWeight="400">
					<b>Vote Report</b>
				</DrawerHeader>

				<DrawerBody>
					<br />
					<p>Your vote has been successfully registered!</p>
					<br />
					<br />
					<Card background="">
						<CardHeader>
							<Heading size="md"> Current vote results </Heading>
						</CardHeader>
						<CardBody>
							<Spacer />
							<StatGroup>
								<Stat>
									<StatLabel>Vote Score</StatLabel>
									<StatNumber>75%</StatNumber>
									<StatHelpText>
										<StatArrow type="increase" />
										0.02%
									</StatHelpText>
								</Stat>

								<Stat>
									<StatLabel>Total Votes</StatLabel>
									<StatNumber>206</StatNumber>
									<StatHelpText>
										<StatArrow type="increase" />
										0.05%
									</StatHelpText>
								</Stat>
							</StatGroup>
						</CardBody>
					</Card>
				</DrawerBody>

				<DrawerFooter></DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
