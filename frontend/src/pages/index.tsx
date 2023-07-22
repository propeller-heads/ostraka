import { useState } from 'react'
import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import Layout from '@/components/Header'
import ContractAbi from '@/abi/Contract.abi'
import { ConnectKitButton } from 'connectkit'
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Box, Button, Flex } from '@chakra-ui/react'

export default function Home() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)
	const [input, setInput] = useState<string>("")

	const { config } = usePrepareContractWrite({
		address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
		abi: ContractAbi,
		enabled: proof != null && address != null,
		functionName: 'vote',
		args: [
			address!,
			proof?.merkle_root ? decode<bigint>('uint256', proof?.merkle_root ?? '') : BigNumber.from(0).toBigInt(),
			proof?.nullifier_hash ? decode<bigint>('uint256', proof?.nullifier_hash ?? '') : BigNumber.from(0).toBigInt(),
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

	const { write } = useContractWrite(config)

	return (
		<Layout>
			{address ? (
				proof ? (<Box>
					<input onChange={(event) => {
						setInput(event.target.value);
					}}></input>
					<Button onClick={write}>Up vote</Button>
					<Button onClick={write}>Down vote</Button>
				</Box>
				) : (
					<IDKitWidget
						signal={address}
						action="your-action" //TODO: Check if this is required
						onSuccess={setProof}
						app_id={process.env.NEXT_PUBLIC_APP_ID!}
					>
						{({ open }) => <button onClick={open}>verify with world id</button>}
					</IDKitWidget>
				)
			) : (<></>
			)}
		</Layout>
	)
}
