import type { Event } from "~/database";
import { db } from "~/database";

export async function getEvent(id: string) {
  return db.event.findUnique({
    where: { id },
    include: {
      _count: {
        select: { guests: true },
      },
      guests: true
    },
  });
}

export async function getEvents(organizationId: string) {
  return db.event.findMany({
    where: { organizationId: organizationId },
    orderBy: { date: "desc" },
    include: {
      _count: {
        select: { guests: true },
      },
    },
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

export async function deleteEvent(id: string) {
  return db.event.deleteMany({
    where: { id },
  });
}
