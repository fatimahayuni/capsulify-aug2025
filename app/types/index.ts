export type CreateUserParams = {
  name: string;
  username: string;
  email: string;
  clerkId: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  clerkId: string;
  bodyTypeId: number;
  onboarded: number;
};

export type BodyType = {
  name: string;
  description: string;
  image?: string;
};

export type InventoryItem = {
  name: string;
  filename: string;
  category: string;
};
