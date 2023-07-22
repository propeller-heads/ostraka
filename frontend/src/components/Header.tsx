import { ReactNode } from 'react'
import { Flex, Menu, Image, Spacer } from '@chakra-ui/react'

import title from '../assets/ostraka.svg'

type Props = {
	children?: ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<Menu>
			<Flex layerStyle={'headerFlex'}>
				<Image boxSize="3rem" hideBelow={'md'} style={{ width: '199.94px' }} ml={5} src={title} alt="ostraka" />
				<Spacer hideFrom={'md'} />
				{children}
			</Flex>
		</Menu>
	)
}
