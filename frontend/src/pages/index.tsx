import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import Layout from '@/components/Header'
import { useEffect, useState } from 'react'
import ContractAbi from '@/abi/Contract.abi'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import CustomSismoConnectButton from '../components/SismoConnectButton'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import {
	Box,
	Button,
	ButtonGroup,
	Input,
	InputGroup,
	InputLeftAddon,
	InputLeftElement,
	InputRightElement,
	Spacer,
	Text,
} from '@chakra-ui/react'

import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
export default function Home() {
	const { address } = useAccount()
	const [humanityProof, setHumanityProof] = useState<ISuccessResult | null>(null)
	const [voteSignature, setVoteSignature] = useState<string | undefined>(undefined)

	const [uri, setURI] = useState<string | undefined>(undefined)
	const [vote, setVote] = useState<boolean | undefined>(undefined)

	const { config } = usePrepareContractWrite({
		abi: ContractAbi,
		enabled: humanityProof != null && address != null,
		functionName: 'vote',
		args: [
			address!,
			humanityProof?.merkle_root
				? decode<bigint>('uint256', humanityProof?.merkle_root ?? '')
				: BigNumber.from(0).toBigInt(),
			humanityProof?.nullifier_hash
				? decode<bigint>('uint256', humanityProof?.nullifier_hash ?? '')
				: BigNumber.from(0).toBigInt(),
			humanityProof?.proof
				? decode<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]>(
						'uint256[8]',
						humanityProof?.proof ?? ''
				  )
				: [
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
						BigNumber.from(0).toBigInt(),
				  ],
		],
	})

	console.log(humanityProof)

	const { write } = useContractWrite(config)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		// Once component is mounted it means we're in the client side
		setIsClient(true)
	}, [])

	return (
		<Layout>
			<Box w="50rem">
				<Text size="lg" color="white">
					Welcome to ostraka! A cutting-edge blockchain voting system that revolutionizes the way we
					participate in democratic processes. Embrace a new era of voting with unprecedented freedom and
					expression, allowing you to have a direct impact on the decisions that matter most to you.
				</Text>
			</Box>
			<br></br>
			<Text> {voteSignature} </Text>

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
							<CustomSismoConnectButton url={uri} vote={vote} setSignature={setVoteSignature} />
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
							{({ open }) => <Button onClick={open}>Generate world id proof</Button>}
						</IDKitWidget>
					</div>
				)
			) : (
				<></>
			)}
		</Layout>
	)
}
