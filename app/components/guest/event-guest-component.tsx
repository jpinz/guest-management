import { Form } from "@remix-run/react";
import dayjs from "dayjs";

import type { EventGuest } from "~/database";

export function EventGuestComponent(props: {
  guest: EventGuest;
  manageGuest: boolean;
  frontDoorMode: boolean;
}) {

  return (
    <tr key={props.guest.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {props.guest.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.guest.user.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {" "}
        {props.guest.checkedIn != null ? (
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-indigo-500"
          >
            {dayjs(props.guest.checkedIn).format("HH:mm:ss")}
          </button>
        ) : (
          <Form method="patch">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:pointer-events-none disabled:bg-indigo-300 hover:bg-indigo-500"
              name="guestId"
              value={props.guest.id}
              disabled={!props.frontDoorMode}
            >
              Check-In
            </button>
          </Form>
        )}
      </td>
      {props.manageGuest && !props.frontDoorMode && (
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <Form method="delete">
            <button
              type="submit"
              className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 hover:bg-red-500"
              name="guestId"
              value={props.guest.id}
            >
              Delete
            </button>
          </Form>
        </td>
      )}
    </tr>
  );
}
