import type {
  Organization,
  Event as PrismaEvent,
  User as PrismaUser,
  EventGuest as PrismaEventGuest,
  PersonalGuest as PrismaPersonalGuest,
} from "@prisma/client";

export type User = PrismaUser & {
  organization: Organization;
};

export type Event = PrismaEvent & {
  guests: EventGuest[];
};

export type EventGuest = PrismaEventGuest & {
  user: PrismaUser;
};

export type PersonalGuest = PrismaPersonalGuest & {
  user: User;
};
