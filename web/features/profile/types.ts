export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  createdAt: Date | string;
  emailVerified: boolean;
}
