import type { Event, EventWithPrismaGuests } from "~/database";
import { db } from "~/database";

export type UpdateEvent = {
  id: Event["id"];
  title?: Event["title"];
  eventType?: Event["eventType"];
  date?: Event["date"];
};

export async function updateEvent({
  id,
  title,
  eventType,
  date,
}: UpdateEvent): Promise<Event> {
  return await db.event.update({
    where: { id: id },
    include: {
      organization: true,
      guests: {
        include: {
          user: true,
        },
      },
    },
    data: {
      title: title,
      eventType: eventType,
      date: date,
    },
  });
}

export async function setEventOpen(id: string, isOpen: boolean): Promise<Event> {
  return await db.event.update({
    where: { id: id },
    include: {
      organization: true,
      guests: {
        include: {
          user: true,
        },
      },
    },
    data: {
      isOpen: isOpen,
    },
  });
}

export async function getEvent(id: string): Promise<Event | null> {
  return db.event.findUnique({
    where: { id },
    include: {
      guests: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getEvents(
  organizationId: string
): Promise<EventWithPrismaGuests[]> {
  return db.event.findMany({
    where: { organizationId: organizationId },
    orderBy: { date: "desc" },
    include: {
      guests: true,
    },
  });
}

export async function createEvent(
  event: Omit<Event, "id" | "guests" | "isOpen">
): Promise<Event> {
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
    include: {
      guests: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function deleteEvent(id: string) {
  return db.event.delete({
    where: { id },
  });
}
