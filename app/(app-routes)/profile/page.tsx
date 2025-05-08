import { SignedIn, UserButton } from '@clerk/nextjs'

type Props = {}

const page = (props: Props) => {
	return (
		<SignedIn>
			<UserButton />
		</SignedIn>
	)
}

export default page
