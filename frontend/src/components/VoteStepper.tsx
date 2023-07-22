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

const steps = [
	{ title: 'Connect Wallet', description: 'Connect your wallet' },
	{ title: 'Verify your Identity', description: 'Verify your identity with WorldCoin' },
	{ title: 'Vote', description: 'Place your vote' },
]

export function VoteStepper() {
	const { activeStep } = useSteps({
		index: 1,
		count: steps.length,
	})

	return (
		<Stepper index={activeStep} width="60rem">
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
