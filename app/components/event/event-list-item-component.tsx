import { useState } from "react";

import { Switch } from "@headlessui/react";
import { Link, useSubmit } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import type { EventWithPrismaGuests } from "~/database";

dayjs.extend(advancedFormat);

export function EventListItemComponent(props: {
  event: EventWithPrismaGuests;
  guestCount: number;
  manageEvents: boolean;
}) {
  const event = props.event;
  const [isOpen, setIsOpen] = useState(event.isOpen);
  const submit = useSubmit();
  
  function handleChange(e: boolean) {
    const formData = new FormData();
    formData.append("isOpen", e);
    submit(formData, { method: "patch", action: `/events/${event.organizationId}/event/${event.id}` });
    setIsOpen(e);
  }

  return (
    <tr key={props.event.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <Link to={`/events/${event.organizationId}/event/${event.id}/guests`}>
          {props.event.title}
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.guestCount}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.event.eventType}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {dayjs(props.event.date).format("ddd, MMM Do YYYY - HH:mm A")}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.manageEvents && (
          <Switch
            checked={isOpen}
            onChange={() => handleChange(!isOpen)}
            name="isOpen"
            className={clsx(
              isOpen ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            )}
          >
            <span className="sr-only">Close/Open Event</span>
            <span
              aria-hidden="true"
              className={clsx(
                isOpen ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.manageEvents && (
          <Link to={`/events/${event.organizationId}/event/${event.id}/edit`}>
            Edit
          </Link>
        )}
      </td>
    </tr>
  );
}
