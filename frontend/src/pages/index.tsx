import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import Layout from '@/components/Header'
import { use, useEffect, useState } from 'react'
import ContractAbi from '@/abi/VoteContract.json'
import VoteDetails from '@/components/VoteDetails'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import CustomSismoConnectButton from '../components/SismoConnectButton'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	Input,
	InputGroup,
	InputLeftAddon,
	InputRightElement,
	Text,
} from '@chakra-ui/react'

import { VoteStepper } from '@/components/VoteStepper'
import { useSessionStorage } from '@/hooks/setSessionStorage'
import { TriangleUpIcon, TriangleDownIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'

export default function Home() {
	const { address } = useAccount()
	const [humanityProof, setHumanityProof] = useState<ISuccessResult | null>(null)

	const [voteSignature, setVoteSignature] = useState<string | undefined>(undefined)
	const [encodedMessage, setEncodedMessage] = useState<string | undefined>(undefined)

	const [voteStep, setVoteStep] = useState<number>(0)

	const [uri, setURI] = useState<string | undefined>(undefined)
	const [vote, setVote] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		console.log('Vote step' + voteStep)
		console.log('Address' + address)
		if (voteStep === 0 && address !== undefined) {
			setVoteStep(1)
		} else if (voteStep === 1 && humanityProof) {
			setVoteStep(2)
		} else if (voteStep === 2 && voteSignature !== undefined) {
			setVoteStep(3)
		}
	}, [address, humanityProof, voteSignature])

	const { config, refetch } = usePrepareContractWrite({
		address: '0xfd241c7E036Db7c7dE131DE116c63e2D983f8d9D',
		abi: ContractAbi,
		enabled: humanityProof != null && address != null,
		functionName: 'vote',
		args: [
			voteSignature,
			encodedMessage,
			address,
			humanityProof?.merkle_root,
			humanityProof?.nullifier_hash,
			humanityProof?.proof,
		],
	})

	console.log(humanityProof)

	const { write } = useContractWrite(config)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		refetch()
	}, [])

	useEffect(() => {
		// Once component is mounted it means we're in the client side
		setIsClient(true)
	}, [])

	return (
		<Layout>
			<Flex flexDirection="column" alignItems="center">
				<br />
				<VoteStepper currentStep={voteStep} />
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
				<Text> {voteSignature} </Text>
			</Flex>

			{isClient && address ? (
				!humanityProof ? (
					<Box>
						<InputGroup size="sm">
							<InputLeftAddon children="https://twitter.com/" />
							<Input
								disabled={voteSignature !== undefined}
								onChange={event => {
									setURI(event.target.value)
								}}
							></Input>
							{vote !== undefined ? (
								vote ? (
									<InputRightElement>
										<TriangleUpIcon color="green.500" />
									</InputRightElement>
								) : (
									<InputRightElement>
										<TriangleDownIcon color="red.500" />
									</InputRightElement>
								)
							) : (
								<></>
							)}
						</InputGroup>
						<ButtonGroup>
							<Button disabled={voteSignature !== undefined} onClick={() => setVote(true)}>
								upvote
							</Button>
							<Button disabled={voteSignature !== undefined} onClick={() => setVote(false)}>
								downvote
							</Button>
						</ButtonGroup>
						{uri !== undefined && vote !== undefined ? (
							<CustomSismoConnectButton
								url={uri}
								vote={vote}
								setSignature={setVoteSignature}
								setEncodedMessage={setEncodedMessage}
							/>
						) : (
							<> </>
						)}
					</Box>
				) : (
					<div>
						<Text>First, we need to verify that you are a real person.</Text>
						<IDKitWidget
							signal={address}
							action="vote" //TODO: Check if this is required
							onSuccess={setHumanityProof}
							app_id={process.env.NEXT_PUBLIC_APP_ID!}
						>
							{({ open }) => (
								<Button w="242px" onClick={open}>
									Generate world id proof
								</Button>
							)}
						</IDKitWidget>
					</div>
				)
			) : (
				<></>
			)}
			<VoteDetails hasVoted={true} />
		</Layout>
	)
}
