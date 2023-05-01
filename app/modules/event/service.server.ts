import type { Event, User } from "~/database";
import { db } from "~/database";

export async function getEvent({ id }: Pick<Event, "id">) {
  return db.event.findUnique({
    where: { id },
  });
}

export async function getEvents({ organizationId }: {
  organizationId: User["organizationId"];
}) {
  return db.event.findMany({
    where: { id: organizationId },
    orderBy: { date: "desc" },
  });
}

export async function createEvent(event: Omit<Event, "id">) {
  return db.event.create({
    data: {
      title: event.title,
      eventType: event.eventType,
      date: event.date,
      organization: {
        connect: {
          id: event.organizationId,
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
