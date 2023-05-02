import type { EventGuest } from "@prisma/client";

import { EventGuestComponent } from "../guest";

export function GuestListComponent(props: { guests: EventGuest[] }) {
  const guests = props.guests;

  return (
    <div>
        {guests.map((guest) => (<EventGuestComponent key={guest.id} guest={guest} />))}
    </div>
  );
}
