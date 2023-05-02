import type { EventGuest } from "@prisma/client";

export function EventGuestComponent(props: { guest: EventGuest }) {
  const guest = props.guest;

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <span>{guest.name}</span>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {guest.gender}
        </div>
      </div>
  );
}
