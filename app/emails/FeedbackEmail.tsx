import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Text,
	Section,
} from '@react-email/components'

type FeedbackData = {
	experience: string
	improvements: string[]
	comments: string
}

type FeedbackEmailProps = {
	userName: string
	userEmail: string
	feedback: FeedbackData
}

export const FeedbackEmail = ({
	userName,
	userEmail,
	feedback,
}: FeedbackEmailProps) => (
	<Html>
		<Head />
		<Preview>New Feedback from {userName}</Preview>
		<Body style={{ backgroundColor: '#f9f2ec', padding: '20px' }}>
			<Container
				style={{
					backgroundColor: '#ffffff',
					padding: '20px',
					borderRadius: '8px',
					maxWidth: '600px',
					margin: '0 auto',
				}}
			>
				<Heading style={{ color: '#4a3427' }}>
					New Feedback Received
				</Heading>

				<Section style={{ marginTop: '20px' }}>
					<Text style={{ color: '#4a3427' }}>From: {userName}</Text>
					<Text style={{ color: '#4a3427' }}>Email: {userEmail}</Text>
					<Text style={{ color: '#4a3427' }}>
						Date: {new Date().toLocaleString()}
					</Text>
				</Section>

				<Section style={{ marginTop: '20px' }}>
					<Heading
						as='h2'
						style={{ color: '#4a3427', fontSize: '18px' }}
					>
						Feedback Details
					</Heading>
					<Text style={{ color: '#4a3427' }}>
						Experience: {feedback.experience}
					</Text>
					<Text style={{ color: '#4a3427' }}>
						Improvements Needed: {feedback.improvements.join(', ')}
					</Text>
					<Text style={{ color: '#4a3427' }}>
						Additional Comments: {feedback.comments}
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
)
