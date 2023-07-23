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
		address: '0xfd241c7E036Db7c7dE131DE116c63e2D983f8d9D',
		chainId: 420,
		abi: ContractAbi,
		enabled: parsedValidityProof != null && address != null,
		functionName: 'vote',
		args: [
			voteSignature,
			encodedMessage,
			address,
			parsedValidityProof?.merkle_root,
			parsedValidityProof?.nullifier_hash,
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
			<Button onClick={() => refetch?.()}>Reload</Button>

			<Button onClick={() => write?.()}>Submit</Button>
		</div>
	)
}
