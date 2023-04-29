import type { Event, User } from "~/database";
import { db } from "~/database";

export async function getEvent({ id }: Pick<Event, "id">) {
  return db.event.findFirst({
    select: {
      id: true,
      eventType: true,
      title: true,
      date: true,
      organization: true,
      guests: true,
    },
    where: { id },
  });
}

export async function getEvents() {
  return db.event.findMany({
    where: {},
    select: {
      id: true,
      eventType: true,
      title: true,
      date: true,
      organization: true,
    },
    orderBy: { date: "desc" },
  });
}

export async function createEvent({
  title,
  eventType,
  date,
  orgId,
}: Pick<Event, "title" | "eventType" | "date"> & {
  orgId: User["organizationId"];
}) {
  return db.event.create({
    data: {
      title,
      eventType,
      date,
      organization: {
        connect: {
          id: orgId,
        },
      },
    },
  });
}

export async function deleteEvent({ id }: Pick<Event, "id">) {
  return db.event.deleteMany({
    where: { id },
  });
}
