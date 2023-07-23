import { useContractRead } from 'wagmi'
import { useRef, useState } from 'react'
import VOTE_ABI from '../abi/VoteContract.json'
import { ChevronDownIcon } from '@chakra-ui/icons'
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
	Button,
	Box,
} from '@chakra-ui/react'

type Props = {
	vote: boolean | undefined
	content: string | undefined
}

export default function VoteDetails({ vote, content }: Props) {
	const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true }) //vote !== undefined })
	const btnRef = useRef(null)

	const [voteData, setVoteData] = useState<any>({
		up_votes: 0,
		down_votes: 0,
		score: 0,
		old_score: 1,
	})

	const voteAddress = '0xfd241c7E036Db7c7dE131DE116c63e2D983f8d9D'
	content = 'hey'

	// Avoid sending failing requests
	const enabled = content !== '' && content !== undefined && vote !== undefined

	console.log('Content: ' + content)
	console.log('Voting up: ' + vote)

	const { refetch } = useContractRead({
		address: voteAddress,
		abi: VOTE_ABI,
		functionName: 'getVotingPool',
		args: [content],
		enabled: enabled,
		onError(error) {
			console.log('ERROR')
			console.error(`Error encountered getting voting pool for ${content}: ${error}`)
			setVoteData({ up_votes: 0, down_votes: 0, score: 0 })
		},
		onSuccess(data) {
			console.log('Data: ' + data)
			// setVoteData({ up_votes: data.positiveVotes, downVotes: data.negativeVotes })
		},
	})

	return (
		<>
			<Box position="fixed" right={'-16'} top="80%" transform="translateY(-50%) rotate(-90deg)" zIndex="999">
				<Button onClick={onOpen} leftIcon={<ChevronDownIcon />} variant="solid" size="sm">
					View vote report
				</Button>
			</Box>
			<Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="sm">
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader textAlign="center" fontSize="30px" fontWeight="400">
						<b>Vote Report</b>
					</DrawerHeader>

					<DrawerBody>
						<br />
						<p>Your {vote ? 'up' : 'down'} vote has been successfully registered!</p>
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
										<StatLabel>Up votes</StatLabel>
										<StatNumber>{voteData.up_votes}</StatNumber>
										<StatHelpText>
											{vote ? (
												<>
													<StatArrow type="increase" />{' '}
													{(1 / (voteData.up_votes - 1)).toFixed(3)}%{' '}
												</>
											) : (
												<>-</>
											)}
										</StatHelpText>
									</Stat>

									<Stat>
										<StatLabel>Down votes</StatLabel>
										<StatNumber>{voteData.down_votes}</StatNumber>
										<StatHelpText>
											{!vote ? (
												<>
													<StatArrow type="increase" />{' '}
													{(1 / (voteData.up_votes - 1)).toFixed(3)}%{' '}
												</>
											) : (
												<>-</>
											)}
										</StatHelpText>
									</Stat>

									<Stat>
										<StatLabel>Score</StatLabel>
										<StatNumber>{voteData.score.toFixed(2)}%</StatNumber>
										<StatHelpText>
											{vote ? <StatArrow type="increase" /> : <StatArrow type="decrease" />}
											{((voteData.score - voteData.old_score) / voteData.old_score).toFixed(3)}%
										</StatHelpText>
									</Stat>
								</StatGroup>
							</CardBody>
						</Card>
					</DrawerBody>

					<DrawerFooter></DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	)
}
