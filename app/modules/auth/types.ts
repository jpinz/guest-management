import type { User } from "@prisma/client";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  organizationId: string;
  email: string;
  user: User;
  expiresIn: number;
  expiresAt: number;
}
