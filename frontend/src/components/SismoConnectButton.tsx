import { ethers } from 'ethers'
import {
	SismoConnectButton,
	AuthType,
	SismoConnectConfig,
	AuthRequest,
	ClaimRequest,
} from '@sismo-core/sismo-connect-react'

const sismoConnectConfig: SismoConnectConfig = {
	appId: '0x4a4e9fbd4e3e4d58a57a504a40611c85',
	vault: {
		// For development purposes insert the Data Sources that you want to impersonate
		// Never use this in production
		impersonate: [
			// EVM Data Sources
			'dhadrien.sismo.eth',
			'0xA4C94A6091545e40fc9c3E0982AEc8942E282F38',
			'0x650501319b84266853489addf3709ccfc60c8d53',
			'0x1b9424ed517f7700e7368e34a9743295a225d889',
			'0x82fbed074f62386ed43bb816f748e8817bf46ff7',
			'0xc281bd4db5bf94f02a8525dca954db3895685700',
			// Github Data Source
			'github:dhadrien',
			// Twitter Data Source
			'twitter:dhadrien_',
			// Telegram Data Source
			'telegram:dhadrien',
		],
	},
	displayRawResponse: false, // this enables you to get access directly to the
	// Sismo Connect Response in the vault instead of redirecting back to the app
}

const sismoAuths: AuthRequest[] = [
	// Anonymous identifier of the vault for this app
	// vaultId = hash(vaultSecret, appId).
	// full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
	{ authType: AuthType.VAULT },
	{
		authType: AuthType.EVM_ACCOUNT,
	},
	{ authType: AuthType.TWITTER, isOptional: false },
]

const sismoClaims: ClaimRequest[] = [
	{
		groupId: '0xb4bc5aaa69446c7901aaadc88d964414', // user 0x650501319b84266853489addf3709ccfc60c8d53 is in web3 social
	},
]

interface MyComponentProps {
	url: string
	vote: boolean
	setSignature: (signature: string) => void
	setEncodedMessage: (message: string) => void
}

export default function CustomSismoConnectButton({ url, vote, setSignature, setEncodedMessage }: MyComponentProps) {
	const encodedMessage = ethers.utils.defaultAbiCoder.encode(['bool', 'string'], [vote, url])
	return (
		<SismoConnectButton
			config={sismoConnectConfig}
			// Auths = Data Source Ownership Requests
			auths={sismoAuths}
			// Claims = prove groump membership of a Data Source in a specific Data Group.
			// Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
			// When doing so Data Source is not shared to the app.
			claims={sismoClaims}
			// Signature = user can sign a message embedded in their zk proof
			signature={{ message: encodedMessage }}
			// responseBytes = the response from Sismo Connect, will be sent onchain
			onResponseBytes={(responseBytes: string) => {
				setEncodedMessage(encodedMessage)
				setSignature(responseBytes)
			}}
			// Some text to display on the button
			text={'Generate Vote Proof'}
		/>
	)
}
