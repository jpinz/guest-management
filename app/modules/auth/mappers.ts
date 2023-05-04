import { db } from "~/database";
import type { SupabaseAuthSession } from "~/integrations/supabase";

import type { AuthSession } from "./types";

export async function mapAuthSession(
  supabaseAuthSession: SupabaseAuthSession | null
): Promise<AuthSession | null> {
  if (!supabaseAuthSession) return null;

  if (!supabaseAuthSession.refresh_token)
    throw new Error("User should have a refresh token");

  if (!supabaseAuthSession.user?.email)
    throw new Error("User should have an email");

  let user = await db.user.findUnique({
    where: { id: supabaseAuthSession.user.id },
    include: { organization: true },
  });

  if (!user) {
    throw new Error("User should have a user account");
  }

  return {
    accessToken: supabaseAuthSession.access_token,
    refreshToken: supabaseAuthSession.refresh_token,
    userId: supabaseAuthSession.user.id,
    organization: user.organization,
    email: supabaseAuthSession.user.email,
    user: user,
    expiresIn: supabaseAuthSession.expires_in ?? -1,
    expiresAt: supabaseAuthSession.expires_at ?? -1,
  };
}
