import type { EventGuest } from "~/database";
import { db } from "~/database";

export async function getEventGuests(eventId: string) {
  return db.eventGuest.findMany({
    where: { eventId: eventId },
    orderBy: { name: "desc" },
  });
}

export async function checkInEventGuest(id: string) {
  return db.eventGuest.update({
    where: { id: id },
    data: {
      checkedIn: new Date(),
    },
  });
}

export async function checkOutEventGuest(id: string) {
  return db.eventGuest.update({
    where: { id: id },
    data: {
      checkedIn: null,
    },
  });
}

export async function addEventGuest(guest: Omit<EventGuest, "id" | "createdAt" | "updatedAt" | "checkedIn">) {
  return db.eventGuest.create({
    data: {
      name: guest.name,
      gender: guest.gender,
      user: {
        connect: {
          id: guest.userId,
        },
      },
      event: {
        connect: {
          id: guest.eventId,
        },
      },
    },
  });
}

export async function deleteEventGuest(id: string) {
  return db.eventGuest.delete({
    where: { id },
  });
}
