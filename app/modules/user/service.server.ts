import type { Role } from "@prisma/client";

import type { PrismaUser, User } from "~/database";
import { db } from "~/database";
import type { AuthSession } from "~/modules/auth";
import {
  createEmailAuthAccount,
  signInWithEmail,
  deleteAuthAccount,
} from "~/modules/auth";

export type UpdateUser = {
  id?: User["id"];
  email?: User["email"];
  name?: User["name"];
  gradYear?: User["gradYear"];
  rushClass?: User["rushClass"];
  role?: User["role"];
  hasSocialPermission?: User["hasSocialPermission"];
}

export async function updateUser({
  id,
  email,
  name,
  gradYear,
  rushClass,
  role,
  hasSocialPermission,
}: UpdateUser): Promise<User> {
  return await db.user.update({
    where: { id: id },
    include: { organization: true },
    data: {
      email: email,
      name: name,
      gradYear: gradYear,
      rushClass: rushClass,
      role: role,
      hasSocialPermission: hasSocialPermission,
    },
  });
}

export async function getUserByEmail(
  email: User["email"]
): Promise<User | null> {
  return await db.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { organization: true },
  });
}

export async function getUsesrByOrganization(
  organizationId: User["organizationId"]
): Promise<User[]> {
  return await db.user.findMany({
    where: { organizationId: organizationId },
    include: { organization: true },
  });
}

async function createUser(user: PrismaUser): Promise<User | null> {
  return await db.user
    .create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        gradYear: user.gradYear,
        rushClass: user.rushClass,
        role: user.role,
        organization: {
          connect: {
            id: user.organizationId,
          },
        },
      },
      include: {
        organization: true,
      },
    })
    .then((user) => user)
    .catch(() => null);
}

export async function tryCreateUser(user: PrismaUser): Promise<User | null> {
  const createdUser = await createUser(user);

  // user account created and have a session but unable to store in User table
  // we should delete the user account to allow retry create account again
  if (!createdUser) {
    await deleteAuthAccount(user.id);
    return null;
  }

  return createdUser;
}

export async function createUserAccount(
  email: string,
  password: string,
  name: string,
  gradYear: number,
  rushClass: number,
  organizationId: string,
  role: Role,
  hasSocialPermission?: boolean
): Promise<AuthSession | null> {
  const authAccount = await createEmailAuthAccount(email, password);

  // ok, no user account created
  if (!authAccount) return null;

  const authSession = await signInWithEmail(email, password);

  // user account created but no session 😱
  // we should delete the user account to allow retry create account again
  if (!authSession) {
    await deleteAuthAccount(authAccount.id);
    return null;
  }

  const user = await tryCreateUser({
    email: email,
    name: name,
    gradYear: gradYear,
    rushClass: rushClass,
    organizationId: organizationId,
    role: role,
    hasSocialPermission: hasSocialPermission ?? false,
    id: authAccount.id,
  });

  if (!user) return null;

  return authSession;
}
