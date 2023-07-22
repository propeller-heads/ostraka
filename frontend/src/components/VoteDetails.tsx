import { useContractRead } from 'wagmi'
import { useRef, useState } from 'react'
import VOTE_ABI from '../abi/VoteContract.json'
import {
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
	content: string | undefined
}

export default function VoteDetails({ hasVoted, content }: Props) {
	const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: hasVoted })
	const btnRef = useRef(null)

	const [voteData, setVoteData] = useState<any>({
		up_votes: undefined,
		down_votes: undefined,
	})

	const voteAddress = '0xfd241c7E036Db7c7dE131DE116c63e2D983f8d9D'

	// Avoid sending failing requests
	const enabled = content !== '' && content !== undefined && hasVoted

	console.log('Content: ' + content)

	const { refetch } = useContractRead({
		address: voteAddress,
		abi: VOTE_ABI,
		functionName: 'getVotingPool',
		args: [content],
		enabled: enabled,
		onError(error) {
			console.error(`Error encountered getting voting pool for ${content}: ${error}`)
		},
		onSuccess(data) {
			console.log('Data: ' + data)
			// setVoteData({ up_votes: data.positiveVotes, downVotes: data.negativeVotes })
		},
	})

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
