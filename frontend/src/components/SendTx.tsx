'use client'

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
		abi: ContractAbi,
		enabled: parsedValidityProof != null && address != null,
		functionName: 'vote',
		args: [
			voteSignature,
			encodedMessage,
			address,
			parsedValidityProof?.merkle_root,
			parsedValidityProof?.nullifier_hash,
			parsedValidityProof?.proof,
		],
	})
	const { write } = useContractWrite(config)

	return <Button onClick={() => write?.()}>Submit</Button>
}
