'use client'

import { useAccount } from 'wagmi'
import Layout from '@/components/Header'
import { useEffect, useState } from 'react'
import VoteDetails from '@/components/VoteDetails'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import CustomSismoConnectButton from '../components/SismoConnectButton'
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

import SendTx from '@/components/SendTx'

import { VoteStepper } from '@/components/VoteStepper'
import { useSessionStorage } from '@/hooks/setSessionStorage'
import { TriangleUpIcon, TriangleDownIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'

export default function Home() {
	const { address } = useAccount()
	const [humanityProof, setHumanityProof] = useSessionStorage('humanityProof', null)

	const [voteSignature, setVoteSignature] = useSessionStorage('voteSignature', undefined)
	const [encodedMessage, setEncodedMessage] = useSessionStorage('encodedMessage', undefined)

	const [uri, setURI] = useSessionStorage('uri', undefined)
	const [vote, setVote] = useSessionStorage('vote', undefined)

	const [voteStep, setVoteStep] = useState<number>(0)

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

	const [isClient, setIsClient] = useState(false)

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
				{isClient && address ? (
					humanityProof ? (
						<Box
							w="500px"
							boxShadow="rgba(0, 0, 0, 0.1) 0px 6px 10px"
							background="rgba(0, 0, 0, 0.1)"
							borderRadius="10px"
							padding={'20px 8px 20px 16px'}
							textAlign="center"
						>
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
							<br />
							<ButtonGroup spacing="25px">
								<Button
									disabled={voteSignature !== undefined}
									onClick={() => setVote(true)}
									width="130px"
									leftIcon={<ArrowUpIcon boxSize={4} />}
								>
									upvote
								</Button>
								<Button
									disabled={voteSignature !== undefined}
									onClick={() => setVote(false)}
									width="130px"
									leftIcon={<ArrowDownIcon boxSize={4} />}
								>
									downvote
								</Button>
							</ButtonGroup>
							<ButtonGroup spacing="25px" mt={'20px'}>
								{uri !== undefined && vote !== undefined ? (
									<CustomSismoConnectButton
										url={'https://twitter.com/${uri}'}
										vote={vote}
										setSignature={setVoteSignature}
										setEncodedMessage={setEncodedMessage}
									/>
								) : (
									<> </>
								)}
							</ButtonGroup>
							{voteSignature !== undefined &&
							encodedMessage !== undefined &&
							address !== undefined &&
							humanityProof !== null ? (
								<SendTx
									voteSignature={voteSignature}
									encodedMessage={encodedMessage}
									address={address}
									humanityProof={humanityProof}
								></SendTx>
							) : (
								<></>
							)}
						</Box>
					) : (
						<Flex flexDirection="column" alignItems="center">
							<Text>First, we need to verify that you are a real person.</Text>
							<br />
							<IDKitWidget
								signal={address}
								action="vote" //TODO: Check if this is required
								onSuccess={(result: ISuccessResult) => {
									setHumanityProof({
										proof: result.proof,
										merkle_root: result.merkle_root,
										nullifier_hash: result.nullifier_hash,
									})
								}}
								app_id="app_staging_68cbb33784d54d3b69de47b29857af3e"
							>
								{({ open }) => (
									<Button w="242px" onClick={open}>
										Generate world id proof
									</Button>
								)}
							</IDKitWidget>
						</Flex>
					)
				) : (
					<></>
				)}
			</Flex>
			<VoteDetails vote={voteSignature !== undefined ? vote : undefined} content={uri} />
		</Layout>
	)
}
