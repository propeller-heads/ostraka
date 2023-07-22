import {
	Box,
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	useSteps,
} from '@chakra-ui/react'

type Props = {
	currentStep: number
}

const steps = [
	{ title: 'Connect Wallet', description: 'Connect your wallet' },
	{ title: 'Verify your Identity', description: 'Verify your identity with WorldCoin' },
	{ title: 'Vote', description: 'Place your vote' },
]

export function VoteStepper({ currentStep }: Props) {
	const { activeStep } = useSteps({
		index: currentStep,
		count: steps.length,
	})

	return (
		<Stepper index={activeStep} width="60rem" colorScheme="yellow">
			{steps.map((step, index) => (
				<Step key={index}>
					<StepIndicator>
						<StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
					</StepIndicator>

					<Box flexShrink="0">
						<StepTitle>{step.title}</StepTitle>
						<StepDescription>{step.description}</StepDescription>
					</Box>

					<StepSeparator />
				</Step>
			))}
		</Stepper>
	)
}
