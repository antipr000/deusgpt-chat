export type User = {
  firebaseId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  plan: string;
  isAdmin?: boolean;
  createdAt: Date;
};
