export type CreateUserParams = {
	name: string
	username: string
	email: string
	clerkId: string
}

export type User = {
	id: number
	name: string
	username: string
	email: string
	clerkId: string
	bodyTypeId: number
	onboarded: number
}

export type BodyType = {
	name: string
	description: string
	image?: string
}

export type InventoryItem = {
	name: string
	filename: string
	category: string
}

export type OnboardingData = {
	ageGroupId: number
	location: string
	bodyTypeId: number
	heightId: number
	favoritePartIds: number[]
	leastFavoritePartIds: number[]
	personalStyleId: number
	occasions: {
		work: number
		dates: number
		social: number
		errands: number
		family: number
		evening: number
		travels: number
	}
	goal: string
	frustration: string
}
