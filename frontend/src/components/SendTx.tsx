'use client'

import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import { Button } from '@chakra-ui/react'
import ContractAbi from '@/abi/VoteContract.json'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

interface MyInterface {
	voteSignature: string
	encodedMessage: string
	address: string
	humanityProof: any
}

export default function SendTx({ voteSignature, encodedMessage, address, humanityProof }: MyInterface) {
	const parsedValidityProof = JSON.parse(humanityProof)
	const { config, refetch, error } = usePrepareContractWrite({
		address: '0xaD16CF286d4ad219630F3C0890baa03F65Ad3d92',
		chainId: 420,
		abi: ContractAbi,
		enabled: parsedValidityProof != null && address != null,
		functionName: 'vote',
		args: [
			voteSignature,
			encodedMessage,
			address,
			parsedValidityProof?.merkle_root
				? decode<BigNumber>('uint256', parsedValidityProof?.merkle_root ?? '')
				: BigNumber.from(0),
			parsedValidityProof?.nullifier_hash
				? decode<BigNumber>('uint256', parsedValidityProof?.nullifier_hash ?? '')
				: BigNumber.from(0),
			parsedValidityProof?.proof
				? decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
						'uint256[8]',
						parsedValidityProof?.proof ?? ''
				  )
				: [
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
				  ],
		],
	})
	const { write } = useContractWrite(config)

	return (
		<div>
			<Button mt={'20px'} onClick={() => write?.()}>
				Submit
			</Button>
		</div>
	)
}
