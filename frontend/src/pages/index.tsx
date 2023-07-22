import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import Layout from '@/components/Header'
import { useEffect, useState } from 'react'
import ContractAbi from '@/abi/Contract.abi'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import CustomSismoConnectButton from '../components/SismoConnectButton'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Box, Button, ButtonGroup, Input, Spacer, Text } from '@chakra-ui/react'

export default function Home() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)
	const [input, setInput] = useState<string>('')

	const { config } = usePrepareContractWrite({
		address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
		abi: ContractAbi,
		enabled: proof != null && address != null,
		functionName: 'vote',
		args: [
			address!,
			proof?.merkle_root ? decode<bigint>('uint256', proof?.merkle_root ?? '') : BigNumber.from(0).toBigInt(),
			proof?.nullifier_hash
				? decode<bigint>('uint256', proof?.nullifier_hash ?? '')
				: BigNumber.from(0).toBigInt(),
			proof?.proof
				? decode<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]>(
						'uint256[8]',
						proof?.proof ?? ''
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

	console.log(proof)

	const { write } = useContractWrite(config)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		// Once component is mounted it means we're in the client side
		setIsClient(true)
	}, [])

	return (
		<Layout>
			<Box
				w="50rem"
				boxShadow="rgba(0, 0, 0, 0.1) 0px 6px 10px"
				background="rgba(0, 0, 0, 0.1)"
				borderRadius="10px"
				padding={'12px 8px 12px 16px'}
			>
				<Text fontSize="20px" color="white" textAlign="center">
					Welcome to ostraka! A cutting-edge blockchain voting system that revolutionizes the way we
					participate in democratic processes. Embrace a new era of voting with unprecedented freedom and
					expression, allowing you to have a direct impact on the decisions that matter most to you.
				</Text>
			</Box>
			<br></br>
			<CustomSismoConnectButton
				url={''}
				vote={false}
				setSingature={function (signature: string): void {
					throw new Error('Function not implemented.')
				}}
			/>
			{isClient && address ? (
				proof ? (
					<Box>
						<ButtonGroup>
							<Input
								onChange={event => {
									setInput(event.target.value)
								}}
							></Input>
							<Button onClick={write}>Up vote</Button>
							<Button onClick={write}>Down vote</Button>
						</ButtonGroup>
					</Box>
				) : (
					<IDKitWidget
						signal={address}
						action="vote" //TODO: Check if this is required
						onSuccess={setProof}
						app_id={process.env.NEXT_PUBLIC_APP_ID!}
					>
						{({ open }) => (
							<Button w="242px" onClick={open}>
								Generate world id proof
							</Button>
						)}
					</IDKitWidget>
				)
			) : (
				<></>
			)}
		</Layout>
	)
}
