import type { Event } from "@prisma/client";
import { NavLink } from "@remix-run/react";

export function EventCardComponent(props: { event: Event, guestCount: number }) {
  const event = props.event;

  return (
    <NavLink to={`/events/${event.organizationId}/event/${event.id}/guests`}>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <span>{event.title}</span>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {event.eventType}
          <br />
          {event.date.toString()}
          <br />
          {props.guestCount}
        </div>
      </div>
    </NavLink>
  );
}


