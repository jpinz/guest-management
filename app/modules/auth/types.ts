import type { Organization } from "@prisma/client";

import type { User } from "~/database/models";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  organization: Organization;
  email: string;
  user: User;
  expiresIn: number;
  expiresAt: number;
}
