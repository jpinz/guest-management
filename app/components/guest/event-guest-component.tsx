import type { EventGuest } from "@prisma/client";
import { Form } from "@remix-run/react";

export function EventGuestComponent(props: {
  guest: EventGuest;
  frontDoorMode: boolean;
}) {
  const guest = props.guest;

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">
        <span>{guest.name}</span>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {guest.checkedIn != null ? (
          <span>{guest.checkedIn.toString()}</span>
        ) : (
          <Form method="patch">
            <button
              type="submit"
              className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-indigo-500"
              name="guestId"
              value={guest.id}
            >
              Check-In
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
